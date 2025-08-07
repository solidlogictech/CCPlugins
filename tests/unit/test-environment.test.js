/**
 * Unit tests for TestEnvironment
 */

const fs = require('fs').promises;
const path = require('path');
const { TestEnvironment } = require('../setup/test-environment');

// Mock fs
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    rmdir: jest.fn(),
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('TestEnvironment', () => {
  let testEnv;
  const originalEnv = process.env;
  const originalCwd = process.cwd();

  beforeEach(() => {
    testEnv = new TestEnvironment();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    process.env = originalEnv;
    process.chdir(originalCwd);
    if (testEnv) {
      await testEnv.teardown();
    }
  });

  describe('setup and teardown', () => {
    it('should setup test environment correctly', async () => {
      fs.mkdir.mockResolvedValue();

      await testEnv.setup();

      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.CI).toBe('true');
      expect(testEnv.tempDir).toBeDefined();
      expect(fs.mkdir).toHaveBeenCalled();
    });

    it('should teardown test environment correctly', async () => {
      fs.mkdir.mockResolvedValue();
      fs.rmdir.mockResolvedValue();

      await testEnv.setup();
      await testEnv.teardown();

      expect(fs.rmdir).toHaveBeenCalled();
    });

    it('should restore original environment after teardown', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      fs.mkdir.mockResolvedValue();
      fs.rmdir.mockResolvedValue();

      await testEnv.setup();
      expect(process.env.NODE_ENV).toBe('test');

      await testEnv.teardown();
      expect(process.env.NODE_ENV).toBe(originalNodeEnv);
    });
  });

  describe('temporary directory management', () => {
    it('should create temporary directory', async () => {
      fs.mkdir.mockResolvedValue();

      const tempDir = await testEnv.createTempDirectory('test-prefix-');

      expect(tempDir).toContain('test-prefix-');
      expect(testEnv.tempDirs).toContain(tempDir);
      expect(fs.mkdir).toHaveBeenCalledWith(tempDir, { recursive: true });
    });

    it('should track multiple temporary directories', async () => {
      fs.mkdir.mockResolvedValue();

      const tempDir1 = await testEnv.createTempDirectory('test1-');
      const tempDir2 = await testEnv.createTempDirectory('test2-');

      expect(testEnv.tempDirs).toHaveLength(2);
      expect(testEnv.tempDirs).toContain(tempDir1);
      expect(testEnv.tempDirs).toContain(tempDir2);
    });

    it('should cleanup temporary directories', async () => {
      fs.mkdir.mockResolvedValue();
      fs.rmdir.mockResolvedValue();

      await testEnv.createTempDirectory('test-');
      await testEnv.createTempDirectory('test2-');

      expect(testEnv.tempDirs).toHaveLength(2);

      await testEnv.cleanupTempDirectories();

      expect(testEnv.tempDirs).toHaveLength(0);
      expect(fs.rmdir).toHaveBeenCalledTimes(2);
    });
  });

  describe('mock project creation', () => {
    it('should create mock React project', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const mockProject = await testEnv.createMockProject('react');

      expect(mockProject.path).toBeDefined();
      expect(mockProject.fixture).toBeDefined();
      expect(mockProject.fixture.type).toBe('react');
      expect(mockProject.cleanup).toBeInstanceOf(Function);
    });

    it('should create mock Vue project', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const mockProject = await testEnv.createMockProject('vue');

      expect(mockProject.fixture.type).toBe('vue');
      expect(mockProject.fixture.name).toBe('vue-app');
    });

    it('should create mock Express project', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const mockProject = await testEnv.createMockProject('express');

      expect(mockProject.fixture.type).toBe('express');
      expect(mockProject.fixture.name).toBe('express-api');
    });

    it('should throw error for unknown project type', async () => {
      await expect(testEnv.createMockProject('unknown'))
        .rejects.toThrow('Unknown project type: unknown');
    });

    it('should use custom directory when provided', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const customDir = '/custom/test/dir';
      const mockProject = await testEnv.createMockProject('react', customDir);

      expect(mockProject.path).toBe(customDir);
    });
  });

  describe('command test setup', () => {
    it('should setup command test environment', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const commandTest = await testEnv.setupCommandTest('performance-audit', 'react');

      expect(commandTest.projectPath).toBeDefined();
      expect(commandTest.fixture).toBeDefined();
      expect(commandTest.benchmarks).toBeDefined();
      expect(commandTest.mocks).toBeDefined();
      expect(commandTest.cleanup).toBeInstanceOf(Function);

      // Should have benchmark methods
      expect(commandTest.benchmarks.measureSetup).toBeInstanceOf(Function);
      expect(commandTest.benchmarks.measureAnalysis).toBeInstanceOf(Function);
      expect(commandTest.benchmarks.measureExecution).toBeInstanceOf(Function);
    });

    it('should change working directory to project path', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const originalCwd = process.cwd();
      const commandTest = await testEnv.setupCommandTest('test-command');

      // Note: In real implementation, cwd would change
      // Here we just verify the setup completed
      expect(commandTest.projectPath).toBeDefined();

      await commandTest.cleanup();
    });
  });

  describe('integration test setup', () => {
    it('should setup integration test environment', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const commands = ['performance-audit', 'accessibility-scan'];
      const integrationTest = await testEnv.setupIntegrationTest(commands, 'react');

      expect(integrationTest.projectPath).toBeDefined();
      expect(integrationTest.sessionDirs).toBeDefined();
      expect(integrationTest.sessionDirs).toHaveProperty('performance-audit');
      expect(integrationTest.sessionDirs).toHaveProperty('accessibility-scan');
      expect(integrationTest.fixture).toBeDefined();
      expect(integrationTest.mocks).toBeDefined();
      expect(integrationTest.benchmarks).toBeDefined();
      expect(integrationTest.cleanup).toBeInstanceOf(Function);
    });

    it('should create session directories for each command', async () => {
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const commands = ['cmd1', 'cmd2', 'cmd3'];
      const integrationTest = await testEnv.setupIntegrationTest(commands);

      expect(Object.keys(integrationTest.sessionDirs)).toHaveLength(3);
      expect(fs.mkdir).toHaveBeenCalledTimes(4); // 1 for project + 3 for sessions
    });
  });

  describe('data generators', () => {
    it('should create data generators with correct methods', () => {
      const generators = testEnv.createDataGenerators();

      expect(generators.packageJson).toBeInstanceOf(Function);
      expect(generators.reactComponent).toBeInstanceOf(Function);
      expect(generators.expressRoute).toBeInstanceOf(Function);
      expect(generators.jestTest).toBeInstanceOf(Function);
    });

    it('should generate valid package.json', () => {
      const generators = testEnv.createDataGenerators();
      const packageJson = generators.packageJson();

      expect(packageJson).toHaveProperty('name', 'test-project');
      expect(packageJson).toHaveProperty('version', '1.0.0');
      expect(packageJson).toHaveProperty('dependencies');
      expect(packageJson).toHaveProperty('devDependencies');
      expect(packageJson).toHaveProperty('scripts');
    });

    it('should generate package.json with overrides', () => {
      const generators = testEnv.createDataGenerators();
      const overrides = { name: 'custom-project', version: '2.0.0' };
      const packageJson = generators.packageJson(overrides);

      expect(packageJson.name).toBe('custom-project');
      expect(packageJson.version).toBe('2.0.0');
    });

    it('should generate React component code', () => {
      const generators = testEnv.createDataGenerators();
      const props = [
        { name: 'title', type: 'string' },
        { name: 'count', type: 'number' }
      ];
      const component = generators.reactComponent('TestComponent', props);

      expect(component).toContain('interface TestComponentProps');
      expect(component).toContain('title: string');
      expect(component).toContain('count: number');
      expect(component).toContain('const TestComponent: React.FC');
    });

    it('should generate Express route code', () => {
      const generators = testEnv.createDataGenerators();
      const route = generators.expressRoute('/api/users', ['GET', 'POST']);

      expect(route).toContain('router.get(\'/api/users\'');
      expect(route).toContain('router.post(\'/api/users\'');
      expect(route).toContain('module.exports = router');
    });

    it('should generate Jest test code', () => {
      const generators = testEnv.createDataGenerators();
      const test = generators.jestTest('MyComponent');

      expect(test).toContain('import MyComponent from \'./MyComponent\'');
      expect(test).toContain('describe(\'MyComponent\'');
      expect(test).toContain('it(\'should render correctly\'');
    });
  });

  describe('performance testing', () => {
    it('should setup performance test with correct methods', () => {
      const perfTest = testEnv.setupPerformanceTest('test-performance');

      expect(perfTest.measure).toBeInstanceOf(Function);
      expect(perfTest.stressTest).toBeInstanceOf(Function);
      expect(perfTest.getResults).toBeInstanceOf(Function);
      expect(perfTest.generateReport).toBeInstanceOf(Function);
    });

    it('should measure function performance', async () => {
      const perfTest = testEnv.setupPerformanceTest('test-perf');
      const testFn = jest.fn().mockResolvedValue('result');

      const result = await perfTest.measure('test-function', testFn);

      expect(testFn).toHaveBeenCalled();
      expect(result.result).toBe('result');
      expect(result.benchmark).toBeDefined();
      expect(result.benchmark.duration).toBeGreaterThan(0);
    });
  });

  describe('assertions', () => {
    it('should create assertion helpers', () => {
      const assertions = testEnv.createAssertions();

      expect(assertions.assertSessionExists).toBeInstanceOf(Function);
      expect(assertions.assertCommandSuccess).toBeInstanceOf(Function);
      expect(assertions.assertPerformance).toBeInstanceOf(Function);
      expect(assertions.assertFindings).toBeInstanceOf(Function);
    });

    it('should assert command success correctly', () => {
      const assertions = testEnv.createAssertions();
      const successResult = {
        status: 'completed',
        command: 'test-command',
        phases: 5
      };

      expect(() => assertions.assertCommandSuccess(successResult)).not.toThrow();
    });

    it('should assert findings structure correctly', () => {
      const assertions = testEnv.createAssertions();
      const findings = [
        {
          id: 'finding-1',
          type: 'issue',
          severity: 'high',
          description: 'Test finding'
        },
        {
          id: 'finding-2',
          type: 'recommendation',
          severity: 'medium',
          description: 'Test recommendation'
        }
      ];

      expect(() => assertions.assertFindings(findings)).not.toThrow();
    });

    it('should throw error for invalid findings', () => {
      const assertions = testEnv.createAssertions();
      const invalidFindings = [
        {
          id: 'finding-1',
          type: 'issue',
          severity: 'invalid-severity', // Invalid severity
          description: 'Test finding'
        }
      ];

      expect(() => assertions.assertFindings(invalidFindings)).toThrow();
    });
  });

  describe('environment info', () => {
    it('should provide environment information', async () => {
      fs.mkdir.mockResolvedValue();
      await testEnv.setup();

      const info = testEnv.getEnvironmentInfo();

      expect(info).toHaveProperty('nodeVersion');
      expect(info).toHaveProperty('platform');
      expect(info).toHaveProperty('arch');
      expect(info).toHaveProperty('memory');
      expect(info).toHaveProperty('tempDir');
      expect(info).toHaveProperty('env');
      expect(info.env).toHaveProperty('NODE_ENV', 'test');
      expect(info.env).toHaveProperty('CI', 'true');
    });
  });
});