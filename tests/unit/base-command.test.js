/**
 * Unit tests for BaseCommand
 */

const BaseCommand = require('../../lib/base-command');
const SessionManager = require('../../lib/session-manager');

// Mock SessionManager
jest.mock('../../lib/session-manager');

// Test implementation of BaseCommand
class TestCommand extends BaseCommand {
  constructor() {
    super('test-command');
    this.setupCalled = false;
    this.analysisCalled = false;
    this.executionCalled = false;
  }

  async validateSetup(args) {
    this.setupCalled = true;
    return true;
  }

  async performAnalysis(args) {
    this.analysisCalled = true;
    return {
      findings: [
        { type: 'issue', severity: 'high', description: 'Test finding' }
      ],
      metrics: { testMetric: 42 }
    };
  }

  async performExecution(args) {
    this.executionCalled = true;
    return {
      status: 'completed',
      actions: ['test action']
    };
  }

  async generateThinkingPrompt(phase, args) {
    return `Test thinking prompt for ${phase}`;
  }
}

describe('BaseCommand', () => {
  let command;
  let mockSessionManager;

  beforeEach(() => {
    // Reset mocks
    SessionManager.mockClear();
    
    // Create mock session manager instance
    mockSessionManager = {
      initialize: jest.fn().mockResolvedValue(true),
      updateProgress: jest.fn().mockResolvedValue({}),
      loadState: jest.fn().mockResolvedValue({
        sessionId: 'test',
        context: {},
        findings: [],
        metrics: {}
      }),
      saveState: jest.fn().mockResolvedValue(true),
      addFinding: jest.fn().mockResolvedValue({ id: 'test-finding' }),
      setMetrics: jest.fn().mockResolvedValue({}),
      getSummary: jest.fn().mockResolvedValue({
        command: 'test-command',
        findingsCount: 1,
        criticalFindings: 0,
        sessionAge: '5m'
      }),
      sessionExists: jest.fn().mockResolvedValue(true)
    };

    SessionManager.mockImplementation(() => mockSessionManager);
    
    command = new TestCommand();
  });

  describe('constructor', () => {
    it('should initialize with correct properties', () => {
      expect(command.commandName).toBe('test-command');
      expect(command.phases).toEqual(['setup', 'discovery', 'analysis', 'execution', 'validation']);
      expect(command.currentPhase).toBe('setup');
      expect(command.extendedThinkingTriggers).toEqual([]);
    });
  });

  describe('execute', () => {
    it('should execute all phases in order', async () => {
      const result = await command.execute();

      expect(mockSessionManager.initialize).toHaveBeenCalled();
      expect(mockSessionManager.updateProgress).toHaveBeenCalledTimes(5); // Once per phase
      expect(command.setupCalled).toBe(true);
      expect(command.analysisCalled).toBe(true);
      expect(command.executionCalled).toBe(true);
      expect(result.status).toBe('completed');
    });

    it('should handle errors gracefully', async () => {
      mockSessionManager.initialize.mockRejectedValue(new Error('Init failed'));

      await expect(command.execute()).rejects.toThrow('Init failed');
      expect(mockSessionManager.addFinding).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          severity: 'critical'
        })
      );
    });
  });

  describe('phase execution', () => {
    it('should execute setup phase correctly', async () => {
      const result = await command.setupPhase({});

      expect(result.phase).toBe('setup');
      expect(result.status).toBe('complete');
      expect(command.setupCalled).toBe(true);
    });

    it('should execute discovery phase and update context', async () => {
      const result = await command.discoveryPhase({});

      expect(result.phase).toBe('discovery');
      expect(mockSessionManager.loadState).toHaveBeenCalled();
      expect(mockSessionManager.saveState).toHaveBeenCalled();
    });

    it('should execute analysis phase and store findings', async () => {
      const result = await command.analysisPhase({});

      expect(result.phase).toBe('analysis');
      expect(command.analysisCalled).toBe(true);
      expect(mockSessionManager.addFinding).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'issue',
          severity: 'high',
          description: 'Test finding'
        })
      );
      expect(mockSessionManager.setMetrics).toHaveBeenCalledWith({ testMetric: 42 });
    });

    it('should execute execution phase', async () => {
      const result = await command.executionPhase({});

      expect(result.phase).toBe('execution');
      expect(command.executionCalled).toBe(true);
    });

    it('should execute validation phase and update final progress', async () => {
      const result = await command.validationPhase({});

      expect(result.phase).toBe('validation');
      expect(mockSessionManager.updateProgress).toHaveBeenCalledWith(
        'Complete', 5, 5
      );
    });
  });

  describe('extended thinking', () => {
    it('should register extended thinking triggers', () => {
      const trigger = {
        name: 'test-trigger',
        condition: jest.fn().mockResolvedValue(true),
        description: 'Test trigger'
      };

      command.registerExtendedThinkingTrigger(
        trigger.name,
        trigger.condition,
        trigger.description
      );

      expect(command.extendedThinkingTriggers).toHaveLength(1);
      expect(command.extendedThinkingTriggers[0].name).toBe('test-trigger');
    });

    it('should detect when extended thinking is needed', async () => {
      const condition = jest.fn().mockResolvedValue(true);
      command.registerExtendedThinkingTrigger('test', condition, 'Test');

      const shouldUse = await command.shouldUseExtendedThinking('analysis', {});

      expect(shouldUse).toBe(true);
      expect(condition).toHaveBeenCalledWith('analysis', {}, command);
    });

    it('should execute extended thinking and store results', async () => {
      const mockState = {
        sessionId: 'test',
        extendedThinking: []
      };
      mockSessionManager.loadState.mockResolvedValue(mockState);

      await command.executeExtendedThinking('analysis', {});

      expect(mockSessionManager.saveState).toHaveBeenCalledWith(
        expect.objectContaining({
          extendedThinking: expect.arrayContaining([
            expect.objectContaining({
              phase: 'analysis',
              prompt: 'Test thinking prompt for analysis'
            })
          ])
        })
      );
    });
  });

  describe('session management', () => {
    it('should resume from existing session', async () => {
      const mockState = {
        phase: 'analysis',
        progress: { completedSteps: 2, totalSteps: 5 }
      };
      mockSessionManager.loadState.mockResolvedValue(mockState);
      mockSessionManager.getSummary.mockResolvedValue({
        lastUpdated: '2023-01-01T00:00:00Z'
      });

      const result = await command.resume();

      expect(mockSessionManager.sessionExists).toHaveBeenCalled();
      expect(result.status).toBe('completed');
    });

    it('should throw error when no session exists to resume', async () => {
      mockSessionManager.sessionExists.mockResolvedValue(false);

      await expect(command.resume()).rejects.toThrow('No existing session found to resume');
    });

    it('should get current status', async () => {
      const mockSummary = {
        command: 'test-command',
        phase: 'analysis',
        findingsCount: 5
      };
      mockSessionManager.getSummary.mockResolvedValue(mockSummary);

      const status = await command.getStatus();

      expect(status).toEqual(mockSummary);
    });

    it('should return no session status when no session exists', async () => {
      mockSessionManager.sessionExists.mockResolvedValue(false);

      const status = await command.getStatus();

      expect(status.status).toBe('no_session');
    });
  });

  describe('summary generation', () => {
    it('should generate comprehensive summary', async () => {
      const mockState = {
        findings: [
          { type: 'issue', severity: 'high' },
          { type: 'recommendation', severity: 'medium' }
        ],
        metrics: { performance: 85 },
        extendedThinking: [{ phase: 'analysis' }]
      };
      mockSessionManager.loadState.mockResolvedValue(mockState);

      const summary = await command.generateSummary();

      expect(summary.command).toBe('test-command');
      expect(summary.status).toBe('completed');
      expect(summary.phases).toBe(5);
      expect(summary.findings.total).toBe(1);
      expect(summary.extendedThinkingUsed).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle errors and log to session', async () => {
      const error = new Error('Test error');
      command.currentPhase = 'analysis';

      await command.handleError(error);

      expect(mockSessionManager.addFinding).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          severity: 'critical',
          description: 'Error in analysis phase: Test error',
          location: 'analysis'
        })
      );
    });
  });

  describe('utility methods', () => {
    it('should categorize findings by type', () => {
      const findings = [
        { type: 'issue' },
        { type: 'issue' },
        { type: 'recommendation' },
        { type: 'optimization' }
      ];

      const categories = command.categorizeFindingsByType(findings);

      expect(categories).toEqual({
        issue: 2,
        recommendation: 1,
        optimization: 1
      });
    });
  });
});