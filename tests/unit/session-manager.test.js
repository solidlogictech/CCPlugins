/**
 * Unit tests for SessionManager
 */

const fs = require('fs').promises;
const path = require('path');
const SessionManager = require('../../lib/session-manager');

// Mock fs for testing
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    copyFile: jest.fn(),
    rmdir: jest.fn()
  }
}));

describe('SessionManager', () => {
  let sessionManager;
  const testCommand = 'test-command';
  
  beforeEach(() => {
    sessionManager = new SessionManager(testCommand);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct paths', () => {
      expect(sessionManager.commandName).toBe(testCommand);
      expect(sessionManager.sessionDir).toBe(path.join(process.cwd(), testCommand));
      expect(sessionManager.stateFile).toBe(path.join(process.cwd(), testCommand, 'state.json'));
      expect(sessionManager.planFile).toBe(path.join(process.cwd(), testCommand, 'plan.md'));
    });
  });

  describe('initialize', () => {
    it('should create session directory and initial state', async () => {
      fs.mkdir.mockResolvedValue();
      fs.access.mockRejectedValue(new Error('File not found')); // File doesn't exist
      fs.writeFile.mockResolvedValue();

      const result = await sessionManager.initialize();

      expect(result).toBe(true);
      expect(fs.mkdir).toHaveBeenCalledWith(sessionManager.sessionDir, { recursive: true });
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      fs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(sessionManager.initialize()).rejects.toThrow('Failed to initialize session');
    });
  });

  describe('getInitialState', () => {
    it('should return valid initial state structure', () => {
      const state = sessionManager.getInitialState();

      expect(state).toHaveProperty('sessionId');
      expect(state).toHaveProperty('command', testCommand);
      expect(state).toHaveProperty('startTime');
      expect(state).toHaveProperty('phase', 'analysis');
      expect(state).toHaveProperty('progress');
      expect(state.progress).toHaveProperty('totalSteps', 0);
      expect(state.progress).toHaveProperty('completedSteps', 0);
      expect(state.progress).toHaveProperty('currentStep', 'initializing');
      expect(state).toHaveProperty('context');
      expect(state).toHaveProperty('findings', []);
      expect(state).toHaveProperty('metrics', {});
    });
  });

  describe('sessionExists', () => {
    it('should return true when state file exists', async () => {
      fs.access.mockResolvedValue();

      const exists = await sessionManager.sessionExists();

      expect(exists).toBe(true);
      expect(fs.access).toHaveBeenCalledWith(sessionManager.stateFile);
    });

    it('should return false when state file does not exist', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const exists = await sessionManager.sessionExists();

      expect(exists).toBe(false);
    });
  });

  describe('loadState', () => {
    it('should load existing state from file', async () => {
      const mockState = { sessionId: 'test', command: testCommand };
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockState));

      const state = await sessionManager.loadState();

      expect(fs.readFile).toHaveBeenCalledWith(sessionManager.stateFile, 'utf8');
      expect(state.sessionId).toBe('test');
    });

    it('should return initial state when file does not exist', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const state = await sessionManager.loadState();

      expect(state.command).toBe(testCommand);
      expect(state.phase).toBe('analysis');
    });

    it('should handle corrupted state file gracefully', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue('invalid json');

      const state = await sessionManager.loadState();

      expect(state.command).toBe(testCommand);
      expect(state.phase).toBe('analysis');
    });
  });

  describe('saveState', () => {
    it('should save state to file', async () => {
      const mockState = { sessionId: 'test', command: testCommand };
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const result = await sessionManager.saveState(mockState);

      expect(result).toBe(true);
      expect(fs.mkdir).toHaveBeenCalledWith(sessionManager.sessionDir, { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        sessionManager.stateFile,
        expect.stringContaining('"sessionId":"test"')
      );
    });

    it('should update lastUpdated timestamp', async () => {
      const mockState = { sessionId: 'test' };
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      await sessionManager.saveState(mockState);

      expect(mockState.lastUpdated).toBeDefined();
      expect(new Date(mockState.lastUpdated)).toBeInstanceOf(Date);
    });
  });

  describe('updateProgress', () => {
    it('should update progress and save state', async () => {
      const mockState = sessionManager.getInitialState();
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockState));
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const result = await sessionManager.updateProgress('testing', 5, 10);

      expect(result.progress.currentStep).toBe('testing');
      expect(result.progress.completedSteps).toBe(5);
      expect(result.progress.totalSteps).toBe(10);
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('addFinding', () => {
    it('should add finding with generated ID and timestamp', async () => {
      const mockState = sessionManager.getInitialState();
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockState));
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const finding = {
        type: 'issue',
        severity: 'high',
        description: 'Test finding'
      };

      const result = await sessionManager.addFinding(finding);

      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.type).toBe('issue');
      expect(result.severity).toBe('high');
      expect(result.description).toBe('Test finding');
    });
  });

  describe('validateState', () => {
    it('should add missing required fields', () => {
      const incompleteState = { sessionId: 'test' };

      const validatedState = sessionManager.validateState(incompleteState);

      expect(validatedState).toHaveProperty('command');
      expect(validatedState).toHaveProperty('startTime');
      expect(validatedState).toHaveProperty('phase');
      expect(validatedState).toHaveProperty('progress');
      expect(validatedState).toHaveProperty('context');
      expect(validatedState).toHaveProperty('findings');
    });

    it('should ensure progress has required structure', () => {
      const stateWithIncompleteProgress = {
        sessionId: 'test',
        command: testCommand,
        startTime: new Date().toISOString(),
        phase: 'analysis',
        progress: {},
        context: {},
        findings: []
      };

      const validatedState = sessionManager.validateState(stateWithIncompleteProgress);

      expect(validatedState.progress).toHaveProperty('totalSteps', 0);
      expect(validatedState.progress).toHaveProperty('completedSteps', 0);
      expect(validatedState.progress).toHaveProperty('currentStep', 'unknown');
    });
  });

  describe('recoverSession', () => {
    it('should backup corrupted state and create fresh state', async () => {
      fs.access.mockResolvedValue();
      fs.copyFile.mockResolvedValue();
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const result = await sessionManager.recoverSession();

      expect(fs.copyFile).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(result.command).toBe(testCommand);
      expect(result.phase).toBe('analysis');
    });
  });

  describe('getSummary', () => {
    it('should return session summary', async () => {
      const mockState = {
        ...sessionManager.getInitialState(),
        findings: [
          { severity: 'critical' },
          { severity: 'high' },
          { severity: 'critical' }
        ]
      };
      fs.access.mockResolvedValueOnce(); // for state file
      fs.readFile.mockResolvedValueOnce(JSON.stringify(mockState));
      fs.access.mockResolvedValueOnce(); // for plan file
      fs.readFile.mockResolvedValueOnce('# Test Plan');

      const summary = await sessionManager.getSummary();

      expect(summary).toHaveProperty('command', testCommand);
      expect(summary).toHaveProperty('phase', 'analysis');
      expect(summary).toHaveProperty('findingsCount', 3);
      expect(summary).toHaveProperty('criticalFindings', 2);
      expect(summary).toHaveProperty('hasPlan', true);
      expect(summary).toHaveProperty('sessionAge');
    });
  });

  describe('utility methods', () => {
    it('should generate unique session IDs', () => {
      const id1 = sessionManager.generateSessionId();
      const id2 = sessionManager.generateSessionId();

      expect(id1).toContain(testCommand);
      expect(id1).not.toBe(id2);
    });

    it('should generate unique IDs', () => {
      const id1 = sessionManager.generateId();
      const id2 = sessionManager.generateId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });

    it('should calculate session age correctly', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const age = sessionManager.getSessionAge(oneHourAgo);

      expect(age).toMatch(/1h \d+m/);
    });
  });
});