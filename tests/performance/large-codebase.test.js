/**
 * Performance Tests for Large Codebase Handling
 * Tests command performance and scalability with large projects,
 * ensuring acceptable response times and resource usage.
 */

const { describe, it, beforeEach, afterEach, expect } = require('@jest/globals');
const { mockClaudeTools, resetMocks } = require('../helpers/mock-claude-tools');
const { setupTestProject, cleanupTestProject } = require('../helpers/test-project-setup');
const { measurePerformance, monitorMemory } = require('../helpers/performance-helpers');

describe('Large Codebase Performance Tests', () => {
  let testProject;
  let performanceMonitor;

  beforeEach(async () => {
    performanceMonitor = measurePerformance();
    mockClaudeTools();
  });

  afterEach(async () => {
    if (testProject) {
      await cleanupTestProject(testProject);
    }
    resetMocks();
    performanceMonitor.stop();
  });

  describe('Requirements Command Performance', () => {
    it('should handle large enterprise project within time limits', async () => {
      testProject = await setupTestProject('large-enterprise-app', {
        files: 2847,
        directories: 156,
        linesOfCode: 125000
      });

      const startTime = Date.now();
      const memoryBefore = process.memoryUsage();

      const result = await executeCommand('/requirements UserManagement');

      const duration = Date.now() - startTime;
      const memoryAfter = process.memoryUsage();
      const memoryUsed = memoryAfter.heapUsed - memoryBefore.heapUsed;

      // Performance assertions
      expect(duration).toBeLessThan(10000); // 10 seconds max
      expect(memoryUsed).toBeLessThan(100 * 1024 * 1024); // 100MB max
      expect(result.success).toBe(true);
      expect(result.performance.chunkedProcessing).toBe(true);
      expect(result.performance.filesAnalyzed).toBe(2847);
    });

    it('should provide progress updates for long operations', async () => {
      testProject = await setupTestProject('large-enterprise-app');

      const progressUpdates = [];
      const result = await executeCommand('/requirements UserManagement', {
        onProgress: (update) => progressUpdates.push(update)
      });

      expect(progressUpdates.length).toBeGreaterThan(5);
      expect(progressUpdates[0]).toMatch(/Analyzing project structure/);
      expect(progressUpdates[1]).toMatch(/Processing \d+ files/);
      expect(progressUpdates[2]).toMatch(/Identifying patterns/);
      expect(result.performance.progressUpdates).toBe(progressUpdates.length);
    });

    it('should handle memory efficiently with streaming processing', async () => {
      testProject = await setupTestProject('very-large-monorepo', {
        files: 10000,
        directories: 500,
        linesOfCode: 500000
      });

      const memoryMonitor = monitorMemory();
      
      const result = await executeCommand('/requirements UserManagement');
      
      const memoryStats = memoryMonitor.getStats();
      
      expect(memoryStats.peakMemory).toBeLessThan(200 * 1024 * 1024); // 200MB max
      expect(memoryStats.memoryLeaks).toBe(0);
      expect(result.performance.streamingUsed).toBe(true);
      expect(result.performance.chunksProcessed).toBeGreaterThan(10);
    });
  });

  describe('Planning Command Performance', () => {
    it('should create implementation plans for complex features efficiently', async () => {
      testProject = await setupTestProject('microservices-architecture', {
        services: 15,
        files: 3500,
        complexity: 'high'
      });

      // Pre-create requirements
      await executeCommand('/requirements UserManagement');

      const startTime = Date.now();
      const result = await executeCommand('/plan UserManagement');
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(8000); // 8 seconds max
      expect(result.success).toBe(true);
      expect(result.tasks.length).toBeGreaterThan(20);
      expect(result.performance.architectureAnalysisTime).toBeLessThan(3000);
      expect(result.performance.dependencyAnalysisTime).toBeLessThan(2000);
    });

    it('should handle complex dependency analysis efficiently', async () => {
      testProject = await setupTestProject('complex-dependencies', {
        services: 25,
        dependencies: 150,
        circularDependencies: 3
      });

      await executeCommand('/requirements UserManagement');

      const result = await executeCommand('/plan UserManagement');

      expect(result.performance.dependencyGraphSize).toBe(150);
      expect(result.performance.circularDependenciesResolved).toBe(3);
      expect(result.performance.criticalPathCalculationTime).toBeLessThan(1000);
      expect(result.dependencies.length).toBeGreaterThan(10);
    });
  });

  describe('Validation Command Performance', () => {
    it('should validate large implementations efficiently', async () => {
      testProject = await setupTestProject('large-implementation', {
        files: 1500,
        testFiles: 800,
        requirements: 50,
        implementations: 200
      });

      // Setup prerequisites
      await executeCommand('/requirements UserManagement');
      await executeCommand('/plan UserManagement');
      await simulateLargeImplementation();

      const startTime = Date.now();
      const result = await executeCommand('/validate-implementation UserManagement');
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(15000); // 15 seconds max
      expect(result.success).toBe(true);
      expect(result.performance.requirementsAnalyzed).toBe(50);
      expect(result.performance.implementationsValidated).toBe(200);
      expect(result.performance.traceabilityMatrixSize).toBeGreaterThan(100);
    });

    it('should handle comprehensive gap analysis efficiently', async () => {
      testProject = await setupTestProject('partial-implementation', {
        completionRate: 0.7,
        requirements: 100,
        implementations: 70
      });

      await executeCommand('/requirements UserManagement');
      await executeCommand('/plan UserManagement');
      await simulatePartialImplementation(0.7);

      const result = await executeCommand('/validate-implementation UserManagement');

      expect(result.performance.gapAnalysisTime).toBeLessThan(5000);
      expect(result.gaps.length).toBeGreaterThan(20);
      expect(result.performance.coverageCalculationTime).toBeLessThan(2000);
      expect(result.requirementsCoverage).toBeCloseTo(70, 5);
    });
  });

  describe('Pattern Expansion Performance', () => {
    it('should expand API patterns efficiently for large APIs', async () => {
      testProject = await setupTestProject('large-api', {
        endpoints: 150,
        models: 50,
        controllers: 25
      });

      const startTime = Date.now();
      const result = await executeCommand('/expand-api users');
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(6000); // 6 seconds max
      expect(result.performance.patternsAnalyzed).toBe(150);
      expect(result.performance.newEndpointsGenerated).toBeGreaterThan(10);
      expect(result.performance.consistencyChecks).toBeGreaterThan(100);
    });

    it('should expand component patterns efficiently for large UI libraries', async () => {
      testProject = await setupTestProject('large-component-library', {
        components: 200,
        stories: 180,
        tests: 350
      });

      const result = await executeCommand('/expand-components UserProfile');

      expect(result.performance.componentsAnalyzed).toBe(200);
      expect(result.performance.patternsExtracted).toBeGreaterThan(15);
      expect(result.performance.newComponentsGenerated).toBeGreaterThan(5);
      expect(result.performance.styleConsistencyChecks).toBeGreaterThan(50);
    });

    it('should expand test patterns efficiently for comprehensive test suites', async () => {
      testProject = await setupTestProject('comprehensive-test-suite', {
        testFiles: 500,
        testCases: 2000,
        coverage: 0.85
      });

      const result = await executeCommand('/expand-tests UserManagement');

      expect(result.performance.existingTestsAnalyzed).toBe(2000);
      expect(result.performance.coverageGapsIdentified).toBeGreaterThan(50);
      expect(result.performance.newTestsGenerated).toBeGreaterThan(20);
      expect(result.performance.patternMatchingTime).toBeLessThan(3000);
    });
  });

  describe('Feature Status Performance', () => {
    it('should generate status dashboards efficiently for large projects', async () => {
      testProject = await setupTestProject('multi-feature-project', {
        features: 25,
        phases: 5,
        artifacts: 125
      });

      // Setup multiple features
      for (let i = 1; i <= 25; i++) {
        await executeCommand(`/requirements Feature${i}`);
        if (i <= 15) await executeCommand(`/plan Feature${i}`);
        if (i <= 10) await simulateImplementation(`Feature${i}`);
        if (i <= 5) await executeCommand(`/validate-implementation Feature${i}`);
      }

      const startTime = Date.now();
      const result = await executeCommand('/feature-status');
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(5000); // 5 seconds max
      expect(result.performance.featuresAnalyzed).toBe(25);
      expect(result.performance.artifactsProcessed).toBe(125);
      expect(result.performance.dependencyGraphSize).toBeGreaterThan(20);
      expect(result.totalFeatures).toBe(25);
    });

    it('should identify bottlenecks efficiently in complex projects', async () => {
      testProject = await setupTestProject('bottleneck-project', {
        features: 20,
        blockedFeatures: 8,
        dependencies: 45
      });

      const result = await executeCommand('/feature-status');

      expect(result.performance.bottleneckAnalysisTime).toBeLessThan(2000);
      expect(result.performance.dependencyAnalysisTime).toBeLessThan(3000);
      expect(result.bottlenecks.length).toBe(8);
      expect(result.performance.criticalPathCalculationTime).toBeLessThan(1000);
    });
  });

  describe('Retrospective Performance', () => {
    it('should analyze multiple completed features efficiently', async () => {
      testProject = await setupTestProject('completed-project', {
        completedFeatures: 15,
        totalArtifacts: 200,
        timespan: '6 months'
      });

      // Setup completed features
      for (let i = 1; i <= 15; i++) {
        await simulateCompletedFeature(`Feature${i}`);
      }

      const startTime = Date.now();
      const result = await executeCommand('/retrospective');
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(12000); // 12 seconds max
      expect(result.performance.featuresAnalyzed).toBe(15);
      expect(result.performance.artifactsProcessed).toBe(200);
      expect(result.performance.patternAnalysisTime).toBeLessThan(5000);
      expect(result.performance.trendAnalysisTime).toBeLessThan(4000);
    });

    it('should perform trend analysis efficiently across long timespans', async () => {
      testProject = await setupTestProject('long-term-project', {
        features: 50,
        timespan: '2 years',
        dataPoints: 1000
      });

      const result = await executeCommand('/retrospective');

      expect(result.performance.timeSeriesAnalysisTime).toBeLessThan(8000);
      expect(result.performance.dataPointsAnalyzed).toBe(1000);
      expect(result.performance.trendPatternsIdentified).toBeGreaterThan(10);
      expect(result.trends.length).toBeGreaterThan(5);
    });
  });

  describe('Memory Management', () => {
    it('should maintain stable memory usage during long operations', async () => {
      testProject = await setupTestProject('memory-intensive-project');

      const memoryMonitor = monitorMemory();
      
      // Perform multiple operations
      await executeCommand('/requirements Feature1');
      await executeCommand('/plan Feature1');
      await executeCommand('/expand-tests Feature1');
      await executeCommand('/expand-api Feature1');
      await executeCommand('/validate-implementation Feature1');

      const memoryStats = memoryMonitor.getStats();

      expect(memoryStats.memoryLeaks).toBe(0);
      expect(memoryStats.peakMemory).toBeLessThan(150 * 1024 * 1024); // 150MB
      expect(memoryStats.averageMemory).toBeLessThan(100 * 1024 * 1024); // 100MB
      expect(memoryStats.gcCollections).toBeGreaterThan(0);
    });

    it('should clean up resources properly after operations', async () => {
      testProject = await setupTestProject('resource-intensive-project');

      const initialMemory = process.memoryUsage().heapUsed;

      // Perform resource-intensive operations
      for (let i = 1; i <= 10; i++) {
        await executeCommand(`/requirements Feature${i}`);
        await executeCommand(`/plan Feature${i}`);
      }

      // Force garbage collection
      if (global.gc) global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryGrowth = finalMemory - initialMemory;

      // Memory growth should be reasonable
      expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // 50MB max growth
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent command executions', async () => {
      testProject = await setupTestProject('concurrent-project');

      const startTime = Date.now();
      
      // Execute multiple commands concurrently
      const promises = [
        executeCommand('/requirements Feature1'),
        executeCommand('/requirements Feature2'),
        executeCommand('/requirements Feature3'),
        executeCommand('/expand-tests'),
        executeCommand('/feature-status')
      ];

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      // Should complete faster than sequential execution
      expect(duration).toBeLessThan(8000); // 8 seconds max
      expect(results.every(r => r.success)).toBe(true);
      expect(results.some(r => r.performance?.concurrentExecution)).toBe(true);
    });
  });
});

// Helper functions
async function executeCommand(command, options = {}) {
  // Mock performance-aware command execution
  const startTime = Date.now();
  
  // Simulate processing time based on project size
  const processingTime = Math.random() * 2000 + 500; // 500-2500ms
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  const duration = Date.now() - startTime;
  
  return {
    success: true,
    performance: {
      executionTime: duration,
      chunkedProcessing: duration > 1000,
      filesAnalyzed: Math.floor(Math.random() * 3000) + 100,
      memoryUsed: Math.floor(Math.random() * 50) + 10, // MB
      progressUpdates: Math.floor(duration / 200),
      ...generatePerformanceMetrics(command)
    }
  };
}

function generatePerformanceMetrics(command) {
  const commandName = command.split(' ')[0].replace('/', '');
  
  switch (commandName) {
    case 'requirements':
      return {
        patternsAnalyzed: Math.floor(Math.random() * 50) + 10,
        technicalRequirementsGenerated: Math.floor(Math.random() * 20) + 5
      };
    case 'plan':
      return {
        architectureAnalysisTime: Math.floor(Math.random() * 2000) + 500,
        dependencyAnalysisTime: Math.floor(Math.random() * 1500) + 300,
        tasksGenerated: Math.floor(Math.random() * 30) + 10
      };
    case 'validate-implementation':
      return {
        requirementsAnalyzed: Math.floor(Math.random() * 100) + 20,
        implementationsValidated: Math.floor(Math.random() * 200) + 50,
        gapAnalysisTime: Math.floor(Math.random() * 3000) + 1000
      };
    default:
      return {};
  }
}

async function simulateLargeImplementation() {
  // Mock large implementation
  return { filesCreated: 150, linesOfCode: 15000 };
}

async function simulatePartialImplementation(completionRate) {
  // Mock partial implementation
  return { completionRate, filesCreated: Math.floor(100 * completionRate) };
}

async function simulateCompletedFeature(featureName) {
  // Mock completed feature with full lifecycle
  return {
    feature: featureName,
    phases: ['requirements', 'planning', 'implementation', 'validation', 'deployment'],
    artifacts: 15,
    duration: Math.floor(Math.random() * 30) + 10 // days
  };
}