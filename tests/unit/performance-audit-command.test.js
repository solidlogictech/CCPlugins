/**
 * Unit tests for PerformanceAuditCommand
 */

const fs = require('fs').promises;
const PerformanceAuditCommand = require('../../lib/commands/performance-audit-command');
const AnalysisUtilities = require('../../lib/analysis-utilities');

// Mock dependencies
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn()
  }
}));

jest.mock('../../lib/analysis-utilities');

describe('PerformanceAuditCommand', () => {
  let command;
  let mockAnalyzer;

  beforeEach(() => {
    // Setup mock analyzer
    mockAnalyzer = {
      detectProjectType: jest.fn(),
      detectFrameworks: jest.fn(),
      analyzeTechnologyStack: jest.fn()
    };
    AnalysisUtilities.mockImplementation(() => mockAnalyzer);

    command = new PerformanceAuditCommand();
    
    // Mock session manager
    command.sessionManager = {
      loadState: jest.fn(),
      saveState: jest.fn(),
      savePlan: jest.fn(),
      addFinding: jest.fn(),
      setMetrics: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct command name', () => {
      expect(command.commandName).toBe('performance-audit');
      expect(command.analyzer).toBeDefined();
    });

    it('should setup extended thinking triggers', () => {
      expect(command.extendedThinkingTriggers.length).toBeGreaterThan(0);
      
      const triggerNames = command.extendedThinkingTriggers.map(t => t.name);
      expect(triggerNames).toContain('large-bundle-analysis');
      expect(triggerNames).toContain('complex-build-config');
      expect(triggerNames).toContain('performance-critical-app');
    });
  });

  describe('validateSetup', () => {
    it('should validate web project successfully', async () => {
      mockAnalyzer.detectProjectType.mockResolvedValue({
        primaryType: 'react'
      });
      fs.access.mockResolvedValue(); // Build config exists

      const result = await command.validateSetup({});

      expect(result).toBe(true);
      expect(mockAnalyzer.detectProjectType).toHaveBeenCalled();
    });

    it('should reject non-web projects', async () => {
      mockAnalyzer.detectProjectType.mockResolvedValue({
        primaryType: 'python'
      });

      await expect(command.validateSetup({}))
        .rejects.toThrow('Performance audit requires a web application project');
    });

    it('should warn about missing build configuration', async () => {
      mockAnalyzer.detectProjectType.mockResolvedValue({
        primaryType: 'react'
      });
      fs.access.mockRejectedValue(new Error('File not found'));

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await command.validateSetup({});

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'No build configuration detected - some analyses may be limited'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('initializeCommand', () => {
    it('should create performance audit plan and baseline', async () => {
      command.sessionManager.loadState.mockResolvedValue({});
      command.sessionManager.savePlan.mockResolvedValue();
      command.sessionManager.saveState.mockResolvedValue();

      const result = await command.initializeCommand({});

      expect(result).toBe(true);
      expect(command.sessionManager.savePlan).toHaveBeenCalled();
      expect(command.sessionManager.saveState).toHaveBeenCalled();
    });

    it('should not overwrite existing baseline', async () => {
      const existingState = {
        baseline: { timestamp: '2023-01-01', bundleSize: 1000 }
      };
      command.sessionManager.loadState.mockResolvedValue(existingState);
      command.sessionManager.savePlan.mockResolvedValue();

      await command.initializeCommand({});

      // Should not call saveState since baseline exists
      expect(command.sessionManager.saveState).not.toHaveBeenCalled();
    });
  });

  describe('analyzeProject', () => {
    it('should analyze project structure correctly', async () => {
      mockAnalyzer.detectProjectType.mockResolvedValue({
        primaryType: 'react'
      });
      mockAnalyzer.detectFrameworks.mockResolvedValue([
        { name: 'React' },
        { name: 'Express' }
      ]);
      mockAnalyzer.analyzeTechnologyStack.mockResolvedValue({
        buildTools: [{ name: 'webpack', version: '^5.0.0', category: 'bundler' }],
        languages: [{ name: 'TypeScript' }, { name: 'JavaScript' }]
      });

      const result = await command.analyzeProject();

      expect(result.projectType).toBe('react');
      expect(result.frameworks).toEqual(['React', 'Express']);
      expect(result.technologies).toEqual(['webpack']);
      expect(result.hasTypeScript).toBe(true);
      expect(result.buildTools).toHaveLength(1);
    });
  });

  describe('performAnalysis', () => {
    beforeEach(() => {
      // Mock analysis methods
      command.analyzeBundleSize = jest.fn().mockResolvedValue({
        findings: [{ type: 'issue', description: 'Large bundle' }],
        metrics: { totalSize: 1024000, chunkCount: 3 }
      });
      command.analyzeRuntimePerformance = jest.fn().mockResolvedValue({
        findings: [{ type: 'recommendation', description: 'Optimize JS' }],
        metrics: { jsExecutionTime: 200 }
      });
      command.analyzeWebVitals = jest.fn().mockResolvedValue({
        findings: [],
        metrics: { lcp: 2100, fid: 80, cls: 0.05 }
      });
      command.analyzeDependencyPerformance = jest.fn().mockResolvedValue({
        findings: [],
        metrics: { totalDependencies: 50 }
      });
    });

    it('should perform comprehensive performance analysis', async () => {
      const result = await command.performAnalysis({});

      expect(result.findings).toHaveLength(2);
      expect(result.metrics.bundleSize).toBe(1024000);
      expect(result.metrics.lcp).toBe(2100);
      expect(result.metrics.dependencyCount).toBe(50);

      expect(command.analyzeBundleSize).toHaveBeenCalled();
      expect(command.analyzeRuntimePerformance).toHaveBeenCalled();
      expect(command.analyzeWebVitals).toHaveBeenCalled();
      expect(command.analyzeDependencyPerformance).toHaveBeenCalled();
    });

    it('should handle analysis errors gracefully', async () => {
      command.analyzeBundleSize.mockRejectedValue(new Error('Bundle analysis failed'));

      const result = await command.performAnalysis({});

      expect(result.findings.some(f => f.type === 'error')).toBe(true);
      expect(result.findings.some(f => f.description.includes('Bundle analysis failed'))).toBe(true);
    });
  });

  describe('analyzeBundleSize', () => {
    it('should analyze bundle size when build directory exists', async () => {
      command.findBuildDirectory = jest.fn().mockResolvedValue('dist');
      command.findBundleFiles = jest.fn().mockResolvedValue([
        'dist/main.js',
        'dist/vendor.js'
      ]);
      fs.stat.mockImplementation((file) => {
        if (file === 'dist/main.js') return Promise.resolve({ size: 600000 });
        if (file === 'dist/vendor.js') return Promise.resolve({ size: 400000 });
        return Promise.resolve({ size: 0 });
      });

      const result = await command.analyzeBundleSize();

      expect(result.metrics.totalSize).toBe(1000000);
      expect(result.metrics.chunkCount).toBe(2);
      expect(result.metrics.assets).toHaveLength(2);
      expect(result.findings.some(f => f.description.includes('Large bundle'))).toBe(true);
    });

    it('should handle missing build directory', async () => {
      command.findBuildDirectory = jest.fn().mockResolvedValue(null);

      const result = await command.analyzeBundleSize();

      expect(result.findings.some(f => f.type === 'warning')).toBe(true);
      expect(result.findings.some(f => f.description.includes('No build output found'))).toBe(true);
      expect(result.metrics.totalSize).toBe(0);
    });

    it('should identify large individual bundles', async () => {
      command.findBuildDirectory = jest.fn().mockResolvedValue('dist');
      command.findBundleFiles = jest.fn().mockResolvedValue(['dist/huge.js']);
      fs.stat.mockResolvedValue({ size: 2 * 1024 * 1024 }); // 2MB

      const result = await command.analyzeBundleSize();

      expect(result.findings.some(f => 
        f.severity === 'high' && f.description.includes('Large bundle detected')
      )).toBe(true);
    });
  });

  describe('analyzeWebVitals', () => {
    it('should analyze Core Web Vitals correctly', async () => {
      command.runLighthouseAudit = jest.fn().mockResolvedValue({
        performance: 85,
        lcp: 3000, // Poor LCP
        fid: 150,  // Poor FID
        cls: 0.15, // Poor CLS
        fcp: 1200,
        tbt: 150
      });

      const result = await command.analyzeWebVitals();

      expect(result.metrics.performanceScore).toBe(85);
      expect(result.metrics.lcp).toBe(3000);
      
      // Should have findings for poor metrics
      expect(result.findings.some(f => f.description.includes('Largest Contentful Paint is slow'))).toBe(true);
      expect(result.findings.some(f => f.description.includes('First Input Delay is high'))).toBe(true);
      expect(result.findings.some(f => f.description.includes('Cumulative Layout Shift is high'))).toBe(true);
    });

    it('should not create findings for good Web Vitals', async () => {
      command.runLighthouseAudit = jest.fn().mockResolvedValue({
        performance: 95,
        lcp: 2000, // Good LCP
        fid: 50,   // Good FID
        cls: 0.05, // Good CLS
        fcp: 1000,
        tbt: 100
      });

      const result = await command.analyzeWebVitals();

      expect(result.findings.filter(f => f.type === 'issue')).toHaveLength(0);
    });
  });

  describe('analyzeDependencyPerformance', () => {
    it('should identify heavy dependencies', async () => {
      command.readPackageJson = jest.fn().mockResolvedValue({
        dependencies: {
          'react': '^18.0.0',
          'moment': '^2.29.0', // Heavy dependency
          'lodash': '^4.17.0'  // Heavy dependency
        },
        devDependencies: {
          'webpack': '^5.0.0'
        }
      });

      const result = await command.analyzeDependencyPerformance();

      expect(result.metrics.totalDependencies).toBe(4);
      expect(result.findings.some(f => 
        f.description.includes('Consider lighter alternative to moment')
      )).toBe(true);
      expect(result.findings.some(f => 
        f.description.includes('Consider lighter alternative to lodash')
      )).toBe(true);
    });

    it('should handle missing package.json', async () => {
      command.readPackageJson = jest.fn().mockResolvedValue({
        dependencies: {},
        devDependencies: {}
      });

      const result = await command.analyzeDependencyPerformance();

      expect(result.metrics.totalDependencies).toBe(0);
      expect(result.findings.filter(f => f.type === 'recommendation')).toHaveLength(0);
    });
  });

  describe('helper methods', () => {
    it('should check if project is web project', () => {
      expect(command.isWebProject('react')).toBe(true);
      expect(command.isWebProject('vue')).toBe(true);
      expect(command.isWebProject('angular')).toBe(true);
      expect(command.isWebProject('node')).toBe(true);
      expect(command.isWebProject('python')).toBe(false);
    });

    it('should format bytes correctly', () => {
      expect(command.formatBytes(0)).toBe('0 Bytes');
      expect(command.formatBytes(1024)).toBe('1 KB');
      expect(command.formatBytes(1024 * 1024)).toBe('1 MB');
      expect(command.formatBytes(1536)).toBe('1.5 KB');
    });

    it('should find build directory', async () => {
      fs.access.mockImplementation((path) => {
        if (path === 'dist') return Promise.resolve();
        return Promise.reject(new Error('Not found'));
      });

      const result = await command.findBuildDirectory();
      expect(result).toBe('dist');
    });

    it('should return null when no build directory found', async () => {
      fs.access.mockRejectedValue(new Error('Not found'));

      const result = await command.findBuildDirectory();
      expect(result).toBe(null);
    });

    it('should find bundle files in directory', async () => {
      fs.readdir.mockResolvedValue([
        { name: 'main.js', isFile: () => true },
        { name: 'styles.css', isFile: () => true },
        { name: 'images', isFile: () => false },
        { name: 'index.html', isFile: () => true }
      ]);

      const result = await command.findBundleFiles('dist');
      
      expect(result).toEqual(['dist/main.js', 'dist/styles.css']);
    });

    it('should get suggested alternatives for dependencies', () => {
      expect(command.getSuggestedAlternative('moment')).toContain('date-fns');
      expect(command.getSuggestedAlternative('lodash')).toContain('native ES6');
      expect(command.getSuggestedAlternative('unknown')).toContain('Consider if this dependency is necessary');
    });
  });

  describe('extended thinking triggers', () => {
    it('should trigger large bundle analysis for bundles > 1MB', async () => {
      command.sessionManager.loadState.mockResolvedValue({
        metrics: { bundleSize: 2 * 1024 * 1024 } // 2MB
      });

      const trigger = command.extendedThinkingTriggers.find(t => t.name === 'large-bundle-analysis');
      const shouldTrigger = await trigger.condition('analysis', {}, command);

      expect(shouldTrigger).toBe(true);
    });

    it('should trigger complex build config for multiple build tools', async () => {
      fs.access.mockImplementation((path) => {
        if (path === 'webpack.config.js' || path === 'vite.config.js') {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Not found'));
      });

      const trigger = command.extendedThinkingTriggers.find(t => t.name === 'complex-build-config');
      const shouldTrigger = await trigger.condition('analysis', {}, command);

      expect(shouldTrigger).toBe(true);
    });

    it('should trigger performance critical app analysis', async () => {
      command.readPackageJson = jest.fn().mockResolvedValue({
        dependencies: {
          'react-virtualized': '^9.0.0',
          'web-vitals': '^3.0.0'
        }
      });

      const trigger = command.extendedThinkingTriggers.find(t => t.name === 'performance-critical-app');
      const shouldTrigger = await trigger.condition('analysis', {}, command);

      expect(shouldTrigger).toBe(true);
    });
  });

  describe('generateThinkingPrompt', () => {
    it('should generate appropriate thinking prompt', async () => {
      const prompt = await command.generateThinkingPrompt('analysis', {});

      expect(prompt).toContain('performance scenario');
      expect(prompt).toContain('Bundle size optimization');
      expect(prompt).toContain('Core Web Vitals');
      expect(prompt).toContain('analysis phase');
    });
  });
});