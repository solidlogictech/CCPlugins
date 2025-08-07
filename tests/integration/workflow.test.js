/**
 * Integration Tests for Complete Workflow
 * Tests the full development workflow from requirements to retrospective,
 * ensuring commands work together seamlessly.
 */

const { describe, it, beforeEach, afterEach, expect } = require('@jest/globals');
const { mockClaudeTools, resetMocks } = require('../helpers/mock-claude-tools');
const { setupTestProject, cleanupTestProject } = require('../helpers/test-project-setup');

describe('Complete Development Workflow Integration', () => {
  let testProject;

  beforeEach(async () => {
    testProject = await setupTestProject('react-express-app');
    mockClaudeTools();
  });

  afterEach(async () => {
    await cleanupTestProject(testProject);
    resetMocks();
  });

  describe('Requirements → Planning → Implementation → Validation Workflow', () => {
    it('should complete full feature development workflow', async () => {
      // Step 1: Create requirements
      const requirements = await executeCommand('/requirements UserProfile');
      expect(requirements.success).toBe(true);
      expect(requirements.planningReady).toBe(true);

      // Step 2: Create implementation plan
      const plan = await executeCommand('/plan UserProfile');
      expect(plan.success).toBe(true);
      expect(plan.requirementsLoaded).toBe(true);
      expect(plan.tasks).toHaveLength(12);

      // Step 3: Simulate implementation (would normally use /scaffold and /implement)
      await simulateImplementation('UserProfile', plan.tasks);

      // Step 4: Validate implementation
      const validation = await executeCommand('/validate-implementation UserProfile');
      expect(validation.success).toBe(true);
      expect(validation.requirementsCoverage).toBeGreaterThan(90);
      expect(validation.criticalGaps).toHaveLength(0);

      // Step 5: Conduct retrospective
      const retrospective = await executeCommand('/retrospective UserProfile');
      expect(retrospective.success).toBe(true);
      expect(retrospective.lessonsLearned).toBeDefined();
      expect(retrospective.processImprovements).toBeDefined();
    });

    it('should maintain state consistency across workflow phases', async () => {
      // Create requirements
      await executeCommand('/requirements UserProfile');
      
      // Verify plan can load requirements
      const plan = await executeCommand('/plan UserProfile');
      expect(plan.requirementsReference).toBe('requirements/plan.md');
      expect(plan.userStories).toHaveLength(5);

      // Verify validation can load both requirements and plan
      await simulateImplementation('UserProfile', plan.tasks);
      const validation = await executeCommand('/validate-implementation UserProfile');
      expect(validation.requirementsLoaded).toBe(true);
      expect(validation.planLoaded).toBe(true);
      expect(validation.traceabilityMatrix).toBeDefined();
    });

    it('should handle workflow interruption and resumption', async () => {
      // Start workflow
      await executeCommand('/requirements UserProfile');
      const plan = await executeCommand('/plan UserProfile');
      
      // Simulate interruption (restart session)
      resetMocks();
      mockClaudeTools();

      // Resume workflow
      const resumedPlan = await executeCommand('/plan resume');
      expect(resumedPlan.sessionResumed).toBe(true);
      expect(resumedPlan.tasks).toEqual(plan.tasks);

      // Continue with validation
      await simulateImplementation('UserProfile', plan.tasks);
      const validation = await executeCommand('/validate-implementation UserProfile');
      expect(validation.success).toBe(true);
    });
  });

  describe('Pattern Expansion Workflow Integration', () => {
    it('should integrate pattern expansion with main workflow', async () => {
      // Complete basic workflow
      await executeCommand('/requirements UserProfile');
      await executeCommand('/plan UserProfile');
      await simulateImplementation('UserProfile');

      // Expand patterns based on implementation
      const expandedTests = await executeCommand('/expand-tests UserProfile');
      expect(expandedTests.newTests).toBeGreaterThan(5);
      expect(expandedTests.coverageImprovement).toBeGreaterThan(10);

      const expandedAPI = await executeCommand('/expand-api users');
      expect(expandedAPI.newEndpoints).toContain('GET /api/v1/users/{id}/profile');
      expect(expandedAPI.newEndpoints).toContain('PUT /api/v1/users/{id}/profile');

      const expandedComponents = await executeCommand('/expand-components UserProfile');
      expect(expandedComponents.newComponents).toContain('UserProfileCard');
      expect(expandedComponents.newComponents).toContain('UserProfileForm');

      // Validate expanded patterns
      const validation = await executeCommand('/validate-implementation UserProfile');
      expect(validation.expandedPatternsValidated).toBe(true);
      expect(validation.patternConsistency).toBeGreaterThan(95);
    });

    it('should maintain consistency across pattern expansions', async () => {
      // Expand multiple patterns
      const apiExpansion = await executeCommand('/expand-api users');
      const componentExpansion = await executeCommand('/expand-components UserProfile');
      const modelExpansion = await executeCommand('/expand-models User');

      // Verify consistency
      expect(apiExpansion.patterns.authentication).toEqual(componentExpansion.patterns.authentication);
      expect(componentExpansion.patterns.validation).toEqual(modelExpansion.patterns.validation);
      expect(modelExpansion.patterns.naming).toEqual(apiExpansion.patterns.naming);
    });
  });

  describe('Multi-Feature Project Integration', () => {
    it('should handle multiple features in parallel', async () => {
      // Start multiple features
      await executeCommand('/requirements UserProfile');
      await executeCommand('/requirements PaymentSystem');
      await executeCommand('/requirements NotificationService');

      // Check feature status
      const status = await executeCommand('/feature-status');
      expect(status.totalFeatures).toBe(3);
      expect(status.phases.requirements.inProgress).toBe(3);

      // Progress features at different rates
      await executeCommand('/plan UserProfile');
      await executeCommand('/plan PaymentSystem');

      // Check updated status
      const updatedStatus = await executeCommand('/feature-status');
      expect(updatedStatus.phases.planning.complete).toBe(2);
      expect(updatedStatus.phases.planning.inProgress).toBe(0);
      expect(updatedStatus.phases.requirements.complete).toBe(3);
    });

    it('should identify cross-feature dependencies', async () => {
      // Create interdependent features
      await executeCommand('/requirements UserProfile');
      await executeCommand('/requirements PaymentSystem');
      
      const userPlan = await executeCommand('/plan UserProfile');
      const paymentPlan = await executeCommand('/plan PaymentSystem');

      // Check dependency detection
      expect(paymentPlan.dependencies).toContain('UserProfile');
      expect(paymentPlan.blockers).toContain('User authentication must be complete');

      const status = await executeCommand('/feature-status');
      expect(status.dependencyGraph).toBeDefined();
      expect(status.criticalPath).toContain('UserProfile → PaymentSystem');
    });

    it('should provide project-wide insights and recommendations', async () => {
      // Complete multiple features
      await completeFeatureWorkflow('UserProfile');
      await completeFeatureWorkflow('PaymentSystem');
      await completeFeatureWorkflow('NotificationService');

      // Generate project retrospective
      const projectRetrospective = await executeCommand('/retrospective');
      expect(projectRetrospective.featuresAnalyzed).toBe(3);
      expect(projectRetrospective.commonPatterns).toBeDefined();
      expect(projectRetrospective.processImprovements).toBeDefined();
      expect(projectRetrospective.teamRecommendations).toBeDefined();
    });
  });

  describe('Error Recovery in Workflow', () => {
    it('should recover from mid-workflow failures', async () => {
      // Start workflow
      await executeCommand('/requirements UserProfile');
      await executeCommand('/plan UserProfile');

      // Simulate failure during implementation
      mockClaudeTools.write.mockRejectedValueOnce(new Error('Disk full'));

      // Attempt validation (should handle missing implementation gracefully)
      const validation = await executeCommand('/validate-implementation UserProfile');
      expect(validation.error).toBe('implementation_not_found');
      expect(validation.recovery).toBe('partial_validation');
      expect(validation.recommendations).toContain('Complete implementation first');
    });

    it('should maintain workflow integrity after recovery', async () => {
      // Create workflow with error
      await executeCommand('/requirements UserProfile');
      
      // Simulate corrupted plan
      await corruptFile('plan/state.json');
      
      // Plan should recover and continue
      const plan = await executeCommand('/plan UserProfile');
      expect(plan.recovery).toBe('state_reconstructed');
      expect(plan.tasks).toBeDefined();

      // Subsequent commands should work normally
      await simulateImplementation('UserProfile', plan.tasks);
      const validation = await executeCommand('/validate-implementation UserProfile');
      expect(validation.success).toBe(true);
    });
  });

  describe('Performance with Large Projects', () => {
    it('should handle large project workflows efficiently', async () => {
      testProject = await setupTestProject('large-enterprise-app');

      const startTime = Date.now();
      
      // Complete workflow for large project
      await executeCommand('/requirements UserManagement');
      await executeCommand('/plan UserManagement');
      await simulateImplementation('UserManagement');
      await executeCommand('/validate-implementation UserManagement');
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(30000); // 30 seconds max for large project
    });

    it('should provide progress updates for long workflows', async () => {
      testProject = await setupTestProject('large-enterprise-app');
      
      const progressUpdates = [];
      await executeCommand('/requirements UserManagement', {
        onProgress: (update) => progressUpdates.push(update)
      });

      expect(progressUpdates.length).toBeGreaterThan(5);
      expect(progressUpdates).toContain('Analyzing large codebase (2,847 files)');
      expect(progressUpdates).toContain('Processing in chunks for optimal performance');
    });
  });
});

// Helper functions
async function executeCommand(command, options = {}) {
  // Mock command execution with realistic responses
  const commandName = command.split(' ')[0].replace('/', '');
  
  switch (commandName) {
    case 'requirements':
      return {
        success: true,
        planningReady: true,
        userStories: Array(5).fill().map((_, i) => `User story ${i + 1}`),
        technicalRequirements: ['JWT auth', 'Input validation', 'Database integration']
      };
      
    case 'plan':
      return {
        success: true,
        requirementsLoaded: true,
        requirementsReference: 'requirements/plan.md',
        userStories: Array(5).fill().map((_, i) => `User story ${i + 1}`),
        tasks: Array(12).fill().map((_, i) => ({
          id: `task-${i + 1}`,
          title: `Implementation task ${i + 1}`,
          effort: '2-4 hours',
          risk: 'low'
        }))
      };
      
    case 'validate-implementation':
      return {
        success: true,
        requirementsLoaded: true,
        planLoaded: true,
        requirementsCoverage: 95,
        criticalGaps: [],
        traceabilityMatrix: {},
        expandedPatternsValidated: true,
        patternConsistency: 98
      };
      
    case 'retrospective':
      return {
        success: true,
        featuresAnalyzed: 1,
        lessonsLearned: ['Better estimation needed', 'Integration complexity underestimated'],
        processImprovements: ['Add buffer time', 'Improve stakeholder communication'],
        commonPatterns: ['Authentication complexity', 'Database migration challenges'],
        teamRecommendations: ['API integration training', 'Performance testing tools']
      };
      
    case 'feature-status':
      return {
        totalFeatures: 3,
        phases: {
          requirements: { complete: 3, inProgress: 0 },
          planning: { complete: 2, inProgress: 0 },
          implementation: { complete: 0, inProgress: 2 },
          validation: { complete: 0, inProgress: 0 }
        },
        dependencyGraph: {},
        criticalPath: ['UserProfile → PaymentSystem']
      };
      
    case 'expand-tests':
      return {
        success: true,
        newTests: 8,
        coverageImprovement: 15,
        patterns: { authentication: 'JWT', validation: 'Joi' }
      };
      
    case 'expand-api':
      return {
        success: true,
        newEndpoints: [
          'GET /api/v1/users/{id}/profile',
          'PUT /api/v1/users/{id}/profile',
          'DELETE /api/v1/users/{id}/profile'
        ],
        patterns: { authentication: 'JWT', naming: 'REST' }
      };
      
    case 'expand-components':
      return {
        success: true,
        newComponents: ['UserProfileCard', 'UserProfileForm', 'UserProfileModal'],
        patterns: { authentication: 'JWT', validation: 'Joi' }
      };
      
    case 'expand-models':
      return {
        success: true,
        newModels: ['UserProfile', 'UserPreferences', 'UserSession'],
        patterns: { validation: 'Joi', naming: 'REST' }
      };
      
    default:
      return { success: true };
  }
}

async function simulateImplementation(featureName, tasks = []) {
  // Mock implementation completion
  return { success: true, tasksCompleted: tasks.length };
}

async function completeFeatureWorkflow(featureName) {
  await executeCommand(`/requirements ${featureName}`);
  const plan = await executeCommand(`/plan ${featureName}`);
  await simulateImplementation(featureName, plan.tasks);
  await executeCommand(`/validate-implementation ${featureName}`);
  await executeCommand(`/retrospective ${featureName}`);
}

async function corruptFile(path) {
  // Mock file corruption
  return true;
}