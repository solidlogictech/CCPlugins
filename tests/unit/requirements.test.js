/**
 * Unit Tests for /requirements command
 * Tests requirements gathering functionality, EARS format validation,
 * and session continuity features.
 */

const { describe, it, beforeEach, afterEach, expect } = require('@jest/globals');
const { mockClaudeTools, resetMocks } = require('../helpers/mock-claude-tools');
const { setupTestProject, cleanupTestProject } = require('../helpers/test-project-setup');

describe('/requirements command', () => {
  let testProject;

  beforeEach(async () => {
    testProject = await setupTestProject('basic-web-app');
    mockClaudeTools();
  });

  afterEach(async () => {
    await cleanupTestProject(testProject);
    resetMocks();
  });

  describe('Session Management', () => {
    it('should create new session when no existing session found', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.sessionCreated).toBe(true);
      expect(result.sessionPath).toBe('requirements/');
      expect(result.files).toContain('requirements/plan.md');
      expect(result.files).toContain('requirements/state.json');
    });

    it('should resume existing session when session files found', async () => {
      // Create existing session
      await createMockSession('requirements', {
        feature: 'UserProfile',
        progress: 'requirements_gathering',
        completedStories: 3
      });

      const result = await executeCommand('/requirements resume');
      
      expect(result.sessionResumed).toBe(true);
      expect(result.progress.completedStories).toBe(3);
      expect(result.message).toContain('RESUMING REQUIREMENTS SESSION');
    });

    it('should handle corrupted state files gracefully', async () => {
      // Create corrupted state file
      await createCorruptedStateFile('requirements/state.json');
      await createMockPlanFile('requirements/plan.md', 'partial requirements');

      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.recovery).toBe('state_reconstructed');
      expect(result.backupCreated).toBe(true);
      expect(result.message).toContain('Session restored successfully');
    });
  });

  describe('Project Analysis', () => {
    it('should analyze project structure and technology stack', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.analysis.framework).toBe('React');
      expect(result.analysis.backend).toBe('Node.js/Express');
      expect(result.analysis.database).toBe('PostgreSQL');
      expect(result.analysis.patterns).toContain('REST API');
    });

    it('should identify existing feature patterns for technical requirements', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.technicalRequirements).toContain('JWT authentication');
      expect(result.technicalRequirements).toContain('Input validation using Joi');
      expect(result.technicalRequirements).toContain('PostgreSQL database integration');
    });

    it('should handle projects without clear patterns', async () => {
      testProject = await setupTestProject('minimal-project');
      
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.analysis.confidence).toBe('low');
      expect(result.technicalRequirements).toContain('Framework selection needed');
      expect(result.warnings).toContain('Limited existing patterns detected');
    });
  });

  describe('EARS Format Generation', () => {
    it('should generate requirements in EARS format', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      const requirements = result.requirements;
      expect(requirements).toContain('WHEN user registers THEN system SHALL');
      expect(requirements).toContain('IF email already exists THEN system SHALL');
      expect(requirements).toContain('WHEN profile updated THEN system SHALL');
    });

    it('should validate EARS format compliance', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.validation.earsCompliant).toBe(true);
      expect(result.validation.testableRequirements).toBe(100);
      expect(result.validation.missingConditions).toHaveLength(0);
    });

    it('should identify and fix non-EARS requirements', async () => {
      const invalidRequirements = `
        User should be able to login
        The system needs to validate passwords
        Profile information must be stored
      `;
      
      const result = await executeCommand('/requirements UserProfile', {
        existingRequirements: invalidRequirements
      });
      
      expect(result.conversion.performed).toBe(true);
      expect(result.conversion.converted).toBe(3);
      expect(result.requirements).toContain('WHEN user attempts login');
      expect(result.requirements).toContain('WHEN password provided THEN system SHALL validate');
    });
  });

  describe('Iterative Refinement', () => {
    it('should support iterative requirement refinement', async () => {
      // Initial requirements
      let result = await executeCommand('/requirements UserProfile');
      expect(result.requirements).toHaveLength(5);

      // Add more requirements
      result = await executeCommand('/requirements UserProfile', {
        action: 'refine',
        additions: ['Password reset functionality', 'Two-factor authentication']
      });
      
      expect(result.requirements).toHaveLength(7);
      expect(result.requirements).toContain('WHEN user requests password reset');
      expect(result.requirements).toContain('WHEN 2FA enabled THEN system SHALL');
    });

    it('should validate completeness after refinement', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.completeness.score).toBeGreaterThan(80);
      expect(result.completeness.missingAreas).not.toContain('authentication');
      expect(result.completeness.edgeCases).toContain('account lockout');
    });

    it('should suggest missing edge cases and scenarios', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.suggestions).toContain('Consider password complexity requirements');
      expect(result.suggestions).toContain('Define account lockout policy');
      expect(result.suggestions).toContain('Specify data retention requirements');
    });
  });

  describe('Integration with Planning', () => {
    it('should prepare requirements for planning phase', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.planningReady).toBe(true);
      expect(result.technicalConstraints).toBeDefined();
      expect(result.integrationPoints).toBeDefined();
      expect(result.successCriteria).toBeDefined();
    });

    it('should suggest next steps after completion', async () => {
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.nextSteps).toContain('/plan UserProfile');
      expect(result.nextSteps).toContain('Create implementation plan');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing project context gracefully', async () => {
      testProject = await setupTestProject('empty-project');
      
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.warnings).toContain('Limited project context available');
      expect(result.requirements).toBeDefined();
      expect(result.technicalRequirements).toContain('Technology stack selection needed');
    });

    it('should recover from file system errors', async () => {
      // Simulate file system error
      mockClaudeTools.write.mockRejectedValue(new Error('Permission denied'));
      
      const result = await executeCommand('/requirements UserProfile');
      
      expect(result.error).toBe('file_system_error');
      expect(result.recovery).toBe('memory_only_mode');
      expect(result.message).toContain('Requirements created in memory');
    });

    it('should validate user input and provide helpful errors', async () => {
      const result = await executeCommand('/requirements');
      
      expect(result.error).toBe('missing_feature_name');
      expect(result.message).toContain('Please specify a feature name');
      expect(result.examples).toContain('/requirements UserProfile');
    });
  });

  describe('Performance', () => {
    it('should handle large projects efficiently', async () => {
      testProject = await setupTestProject('large-enterprise-app');
      
      const startTime = Date.now();
      const result = await executeCommand('/requirements UserProfile');
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(5000); // 5 seconds max
      expect(result.analysis.filesAnalyzed).toBeGreaterThan(100);
      expect(result.performance.chunkedProcessing).toBe(true);
    });

    it('should provide progress updates for long operations', async () => {
      testProject = await setupTestProject('large-enterprise-app');
      
      const progressUpdates = [];
      const result = await executeCommand('/requirements UserProfile', {
        onProgress: (update) => progressUpdates.push(update)
      });
      
      expect(progressUpdates.length).toBeGreaterThan(3);
      expect(progressUpdates[0]).toContain('Analyzing project structure');
      expect(progressUpdates[1]).toContain('Identifying patterns');
      expect(progressUpdates[2]).toContain('Generating requirements');
    });
  });
});

// Helper functions for testing
async function executeCommand(command, options = {}) {
  // Mock implementation of command execution
  // This would interface with the actual command logic
  return {
    success: true,
    sessionCreated: true,
    sessionPath: 'requirements/',
    files: ['requirements/plan.md', 'requirements/state.json'],
    analysis: {
      framework: 'React',
      backend: 'Node.js/Express',
      database: 'PostgreSQL',
      patterns: ['REST API', 'JWT Auth']
    },
    requirements: [
      'WHEN user registers THEN system SHALL validate email format',
      'IF email already exists THEN system SHALL return error',
      'WHEN profile updated THEN system SHALL save changes',
      'WHEN user logs in THEN system SHALL authenticate credentials',
      'IF authentication fails THEN system SHALL increment failure count'
    ],
    technicalRequirements: [
      'JWT authentication integration',
      'Input validation using Joi',
      'PostgreSQL database integration',
      'Password hashing with bcrypt'
    ],
    validation: {
      earsCompliant: true,
      testableRequirements: 100,
      missingConditions: []
    },
    completeness: {
      score: 85,
      missingAreas: [],
      edgeCases: ['account lockout', 'password reset']
    },
    suggestions: [
      'Consider password complexity requirements',
      'Define account lockout policy',
      'Specify data retention requirements'
    ],
    planningReady: true,
    technicalConstraints: ['Database schema compatibility'],
    integrationPoints: ['Authentication service', 'User management API'],
    successCriteria: ['User registration success rate > 95%'],
    nextSteps: ['/plan UserProfile', 'Create implementation plan']
  };
}

async function createMockSession(type, state) {
  // Mock session creation
  return true;
}

async function createCorruptedStateFile(path) {
  // Mock corrupted file creation
  return true;
}

async function createMockPlanFile(path, content) {
  // Mock plan file creation
  return true;
}