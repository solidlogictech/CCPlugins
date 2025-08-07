/**
 * Test Environment Setup
 * Configures testing environment for advanced web development commands
 */

const path = require('path');
const fs = require('fs').promises;
const ProjectFixtures = require('../fixtures/project-fixtures');
const MockExternalTools = require('../mocks/external-tools');
const PerformanceBenchmarks = require('../utils/performance-benchmarks');

class TestEnvironment {
  constructor() {
    this.fixtures = new ProjectFixtures();
    this.mocks = new MockExternalTools();
    this.benchmarks = new PerformanceBenchmarks();
    this.tempDirs = [];
    this.originalEnv = {};
  }

  /**
   * Setup test environment
   */
  async setup() {
    // Store original environment
    this.originalEnv = { ...process.env };

    // Setup test environment variables
    process.env.NODE_ENV = 'test';
    process.env.CI = 'true';
    process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';

    // Setup mock external tools
    const mockEnv = this.mocks.setupTestEnvironment();
    this.mockRestore = mockEnv.restore;

    // Create temp directory for test files
    this.tempDir = await this.createTempDirectory();

    console.log(`Test environment setup complete. Temp dir: ${this.tempDir}`);
    return this;
  }

  /**
   * Teardown test environment
   */
  async teardown() {
    // Restore original environment
    process.env = this.originalEnv;

    // Restore mocks
    if (this.mockRestore) {
      this.mockRestore();
    }

    // Clean up temporary directories
    await this.cleanupTempDirectories();

    // Clear benchmarks
    this.benchmarks.clear();

    console.log('Test environment teardown complete');
  }

  /**
   * Create a temporary directory for testing
   */
  async createTempDirectory(prefix = 'test-') {
    const tempDir = path.join(__dirname, '..', 'temp', `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.mkdir(tempDir, { recursive: true });
    this.tempDirs.push(tempDir);
    return tempDir;
  }

  /**
   * Create mock project for testing
   */
  async createMockProject(projectType, customDir = null) {
    const fixture = this.fixtures.getFixture(projectType);
    if (!fixture) {
      throw new Error(`Unknown project type: ${projectType}`);
    }

    const projectDir = customDir || await this.createTempDirectory(`${projectType}-project-`);
    await this.fixtures.createMockProject(fixture, projectDir);

    return {
      path: projectDir,
      fixture,
      cleanup: async () => {
        await this.fixtures.cleanupMockProject(projectDir);
      }
    };
  }

  /**
   * Setup command test environment
   */
  async setupCommandTest(commandName, projectType = 'react') {
    const mockProject = await this.createMockProject(projectType);
    const commandSuite = this.benchmarks.createCommandSuite(commandName);

    // Change to project directory for testing
    const originalCwd = process.cwd();
    process.chdir(mockProject.path);

    return {
      projectPath: mockProject.path,
      fixture: mockProject.fixture,
      benchmarks: commandSuite,
      mocks: this.mocks,
      cleanup: async () => {
        process.chdir(originalCwd);
        await mockProject.cleanup();
      }
    };
  }

  /**
   * Create integration test environment
   */
  async setupIntegrationTest(commands = [], projectType = 'react') {
    const mockProject = await this.createMockProject(projectType);
    const originalCwd = process.cwd();
    process.chdir(mockProject.path);

    // Setup session directories for each command
    const sessionDirs = {};
    for (const command of commands) {
      const sessionDir = path.join(mockProject.path, command);
      await fs.mkdir(sessionDir, { recursive: true });
      sessionDirs[command] = sessionDir;
    }

    return {
      projectPath: mockProject.path,
      sessionDirs,
      fixture: mockProject.fixture,
      mocks: this.mocks,
      benchmarks: this.benchmarks,
      cleanup: async () => {
        process.chdir(originalCwd);
        await mockProject.cleanup();
      }
    };
  }

  /**
   * Mock file system operations
   */
  mockFileSystem() {
    const originalFs = require('fs');
    const mockFs = {
      ...originalFs,
      promises: {
        ...originalFs.promises,
        readFile: jest.fn(),
        writeFile: jest.fn(),
        mkdir: jest.fn(),
        readdir: jest.fn(),
        access: jest.fn(),
        stat: jest.fn()
      }
    };

    return {
      mock: mockFs,
      restore: () => {
        // Restore would be handled by jest.restoreAllMocks()
      }
    };
  }

  /**
   * Create test data generators
   */
  createDataGenerators() {
    return {
      // Generate mock package.json
      packageJson: (overrides = {}) => ({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          '@testing-library/react': '^13.4.0',
          jest: '^29.5.0'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test'
        },
        ...overrides
      }),

      // Generate mock component files
      reactComponent: (name, props = []) => `
import React from 'react';

interface ${name}Props {
  ${props.map(prop => `${prop.name}: ${prop.type};`).join('\n  ')}
}

const ${name}: React.FC<${name}Props> = ({ ${props.map(p => p.name).join(', ')} }) => {
  return (
    <div className="${name.toLowerCase()}">
      <h1>${name}</h1>
      {/* Component content */}
    </div>
  );
};

export default ${name};
      `,

      // Generate mock API routes
      expressRoute: (path, methods = ['GET']) => `
const express = require('express');
const router = express.Router();

${methods.map(method => `
router.${method.toLowerCase()}('${path}', async (req, res) => {
  try {
    // Route implementation
    res.json({ message: '${method} ${path} success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
`).join('\n')}

module.exports = router;
      `,

      // Generate mock test files
      jestTest: (componentName) => `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('should render correctly', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName}')).toBeInTheDocument();
  });

  it('should handle props correctly', () => {
    const props = { testProp: 'test value' };
    render(<${componentName} {...props} />);
    // Add assertions
  });
});
      `
    };
  }

  /**
   * Setup performance testing
   */
  setupPerformanceTest(testName) {
    const suite = this.benchmarks.createCommandSuite(testName);
    
    return {
      measure: async (name, fn) => {
        return await this.benchmarks.measure(`${testName}-${name}`, fn);
      },
      stressTest: async (fn, iterations = 10) => {
        return await this.benchmarks.stressTest(`${testName}-stress`, fn, iterations);
      },
      getResults: () => {
        return this.benchmarks.getAllResults().filter(r => r.name.startsWith(testName));
      },
      generateReport: () => {
        return this.benchmarks.generateReport();
      }
    };
  }

  /**
   * Create assertion helpers
   */
  createAssertions() {
    return {
      // Assert session file exists and has correct structure
      assertSessionExists: async (commandName, projectPath = process.cwd()) => {
        const sessionDir = path.join(projectPath, commandName);
        const stateFile = path.join(sessionDir, 'state.json');
        const planFile = path.join(sessionDir, 'plan.md');

        try {
          await fs.access(sessionDir);
          await fs.access(stateFile);
          
          const stateContent = await fs.readFile(stateFile, 'utf8');
          const state = JSON.parse(stateContent);
          
          expect(state).toHaveProperty('sessionId');
          expect(state).toHaveProperty('command', commandName);
          expect(state).toHaveProperty('phase');
          expect(state).toHaveProperty('progress');
          
          return { sessionDir, stateFile, planFile, state };
        } catch (error) {
          throw new Error(`Session assertion failed: ${error.message}`);
        }
      },

      // Assert command completed successfully
      assertCommandSuccess: (result) => {
        expect(result).toHaveProperty('status', 'completed');
        expect(result).toHaveProperty('command');
        expect(result).toHaveProperty('phases');
        expect(result.phases).toBeGreaterThan(0);
      },

      // Assert performance benchmarks pass
      assertPerformance: (benchmarkName, maxDuration = 5000, maxMemory = 100 * 1024 * 1024) => {
        const result = this.benchmarks.getBenchmarkResult(benchmarkName);
        expect(result).toBeTruthy();
        expect(result.duration).toBeLessThan(maxDuration);
        expect(result.memoryDelta.heapUsed).toBeLessThan(maxMemory);
      },

      // Assert findings have expected structure
      assertFindings: (findings) => {
        expect(Array.isArray(findings)).toBe(true);
        
        for (const finding of findings) {
          expect(finding).toHaveProperty('id');
          expect(finding).toHaveProperty('type');
          expect(finding).toHaveProperty('severity');
          expect(finding).toHaveProperty('description');
          expect(['critical', 'high', 'medium', 'low']).toContain(finding.severity);
        }
      }
    };
  }

  /**
   * Clean up temporary directories
   */
  async cleanupTempDirectories() {
    for (const dir of this.tempDirs) {
      try {
        await fs.rmdir(dir, { recursive: true });
      } catch (error) {
        console.warn(`Failed to cleanup temp directory ${dir}: ${error.message}`);
      }
    }
    this.tempDirs = [];
  }

  /**
   * Get environment info for debugging
   */
  getEnvironmentInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      tempDir: this.tempDir,
      tempDirs: this.tempDirs.length,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        CI: process.env.CI
      }
    };
  }
}

// Global test environment instance
let globalTestEnv = null;

/**
 * Get or create global test environment
 */
function getTestEnvironment() {
  if (!globalTestEnv) {
    globalTestEnv = new TestEnvironment();
  }
  return globalTestEnv;
}

/**
 * Setup global test environment (for use in setupFilesAfterEnv)
 */
async function setupGlobalTestEnvironment() {
  const env = getTestEnvironment();
  await env.setup();
  
  // Make available globally
  global.testEnv = env;
  global.testFixtures = env.fixtures;
  global.testMocks = env.mocks;
  global.testBenchmarks = env.benchmarks;
  
  return env;
}

/**
 * Teardown global test environment
 */
async function teardownGlobalTestEnvironment() {
  if (globalTestEnv) {
    await globalTestEnv.teardown();
    globalTestEnv = null;
    
    // Clean up globals
    delete global.testEnv;
    delete global.testFixtures;
    delete global.testMocks;
    delete global.testBenchmarks;
  }
}

module.exports = {
  TestEnvironment,
  getTestEnvironment,
  setupGlobalTestEnvironment,
  teardownGlobalTestEnvironment
};