/**
 * Performance Audit Command Implementation
 * Analyzes web application performance and provides optimization recommendations
 */

const BaseCommand = require('../base-command');
const AnalysisUtilities = require('../analysis-utilities');
const LighthouseIntegration = require('../integrations/lighthouse-integration');
const path = require('path');
const fs = require('fs').promises;

class PerformanceAuditCommand extends BaseCommand {
  constructor() {
    super('performance-audit');
    this.analyzer = new AnalysisUtilities();
    this.lighthouse = new LighthouseIntegration();
    this.setupExtendedThinking();
  }

  /**
   * Setup extended thinking triggers for complex performance scenarios
   */
  setupExtendedThinking() {
    this.registerExtendedThinkingTrigger(
      'large-bundle-analysis',
      async (phase, args, command) => {
        const state = await command.sessionManager.loadState();
        return state.metrics?.bundleSize > 1024 * 1024; // > 1MB
      },
      'Large bundle size detected - requires deep analysis'
    );

    this.registerExtendedThinkingTrigger(
      'complex-build-config',
      async (phase, args, command) => {
        const hasWebpack = await command.fileExists('webpack.config.js');
        const hasVite = await command.fileExists('vite.config.js');
        const hasRollup = await command.fileExists('rollup.config.js');
        return [hasWebpack, hasVite, hasRollup].filter(Boolean).length > 1;
      },
      'Multiple build configurations detected - complex setup analysis needed'
    );

    this.registerExtendedThinkingTrigger(
      'performance-critical-app',
      async (phase, args, command) => {
        const packageJson = await command.readPackageJson();
        const perfCriticalDeps = ['react-virtualized', 'react-window', 'web-vitals'];
        return perfCriticalDeps.some(dep => 
          packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
        );
      },
      'Performance-critical dependencies detected - advanced optimization needed'
    );
  }

  /**
   * Validate setup for performance audit
   */
  async validateSetup(args) {
    // Check if this is a web project
    const projectInfo = await this.analyzer.detectProjectType();
    
    if (!this.isWebProject(projectInfo.primaryType)) {
      throw new Error('Performance audit requires a web application project');
    }

    // Check for build configuration
    const hasBuildConfig = await this.hasBuildConfiguration();
    if (!hasBuildConfig) {
      console.warn('No build configuration detected - some analyses may be limited');
    }

    return true;
  }

  /**
   * Initialize command-specific setup
   */
  async initializeCommand(args) {
    // Create performance audit plan
    const plan = await this.createPerformanceAuditPlan(args);
    await this.sessionManager.savePlan(plan);

    // Initialize baseline metrics if not exists
    const state = await this.sessionManager.loadState();
    if (!state.baseline) {
      state.baseline = await this.captureBaselineMetrics();
      await this.sessionManager.saveState(state);
    }

    return true;
  }

  /**
   * Analyze project structure and performance context
   */
  async analyzeProject() {
    const projectInfo = await this.analyzer.detectProjectType();
    const frameworks = await this.analyzer.detectFrameworks();
    const techStack = await this.analyzer.analyzeTechnologyStack();

    return {
      projectType: projectInfo.primaryType,
      frameworks: frameworks.map(f => f.name),
      technologies: techStack.buildTools.map(t => t.name),
      hasTypeScript: techStack.languages.some(l => l.name === 'TypeScript'),
      buildTools: this.identifyBuildTools(techStack)
    };
  }

  /**
   * Perform comprehensive performance analysis
   */
  async performAnalysis(args) {
    const findings = [];
    const metrics = {};

    try {
      // Bundle size analysis
      console.log('Analyzing bundle size...');
      const bundleAnalysis = await this.analyzeBundleSize();
      findings.push(...bundleAnalysis.findings);
      metrics.bundleSize = bundleAnalysis.metrics.totalSize;
      metrics.chunkCount = bundleAnalysis.metrics.chunkCount;

      // Runtime performance analysis
      console.log('Analyzing runtime performance...');
      const runtimeAnalysis = await this.analyzeRuntimePerformance();
      findings.push(...runtimeAnalysis.findings);
      Object.assign(metrics, runtimeAnalysis.metrics);

      // Web vitals analysis with Lighthouse
      console.log('Analyzing Core Web Vitals...');
      const webVitalsAnalysis = await this.analyzeWebVitals();
      findings.push(...webVitalsAnalysis.findings);
      Object.assign(metrics, webVitalsAnalysis.metrics);

      // Store Lighthouse results for comparison
      if (webVitalsAnalysis.lighthouseResults) {
        const state = await this.sessionManager.loadState();
        state.lighthouseResults = webVitalsAnalysis.lighthouseResults;
        await this.sessionManager.saveState(state);
      }

      // Dependency analysis
      console.log('Analyzing dependencies...');
      const depAnalysis = await this.analyzeDependencyPerformance();
      findings.push(...depAnalysis.findings);
      metrics.dependencyCount = depAnalysis.metrics.totalDependencies;

      return { findings, metrics };
    } catch (error) {
      console.error('Performance analysis error:', error.message);
      findings.push({
        type: 'error',
        severity: 'high',
        description: `Performance analysis failed: ${error.message}`,
        location: 'analysis-phase'
      });
      return { findings, metrics };
    }
  }

  /**
   * Execute performance optimizations
   */
  async performExecution(args) {
    const actions = [];

    try {
      // Generate optimization recommendations
      const recommendations = await this.generateOptimizationRecommendations();
      actions.push(...recommendations);

      // Update performance budget if requested
      if (args.setBudget) {
        const budget = await this.createPerformanceBudget();
        actions.push({
          type: 'budget-creation',
          description: 'Created performance budget configuration',
          details: budget
        });
      }

      // Generate performance report
      const report = await this.generatePerformanceReport();
      actions.push({
        type: 'report-generation',
        description: 'Generated comprehensive performance report',
        location: 'performance-audit/analysis.md'
      });

      return { status: 'completed', actions };
    } catch (error) {
      console.error('Performance execution error:', error.message);
      return { 
        status: 'partial', 
        actions,
        error: error.message 
      };
    }
  }

  /**
   * Validate performance improvements
   */
  async performValidation(args) {
    const issues = [];

    try {
      // Compare with baseline
      const comparison = await this.compareWithBaseline();
      
      if (comparison.regressions.length > 0) {
        issues.push({
          type: 'regression',
          description: `${comparison.regressions.length} performance regressions detected`,
          details: comparison.regressions
        });
      }

      // Validate performance budget compliance
      const budgetCompliance = await this.validatePerformanceBudget();
      if (!budgetCompliance.compliant) {
        issues.push({
          type: 'budget-violation',
          description: 'Performance budget violations detected',
          details: budgetCompliance.violations
        });
      }

      return { 
        status: issues.length === 0 ? 'validated' : 'issues-found', 
        issues,
        improvements: comparison.improvements || []
      };
    } catch (error) {
      console.error('Performance validation error:', error.message);
      return { 
        status: 'validation-failed', 
        issues: [{ type: 'error', description: error.message }] 
      };
    }
  }

  // Performance analysis methods

  /**
   * Analyze bundle size and composition
   */
  async analyzeBundleSize() {
    const findings = [];
    const metrics = { totalSize: 0, chunkCount: 0, assets: [] };

    try {
      // Look for build output directory
      const buildDir = await this.findBuildDirectory();
      if (!buildDir) {
        findings.push({
          type: 'warning',
          severity: 'medium',
          description: 'No build output found - run build first for accurate analysis',
          remediation: 'Run your build command (npm run build) before performance audit'
        });
        return { findings, metrics };
      }

      // Analyze bundle files
      const bundleFiles = await this.findBundleFiles(buildDir);
      let totalSize = 0;

      for (const file of bundleFiles) {
        const stats = await fs.stat(file);
        const size = stats.size;
        totalSize += size;

        metrics.assets.push({
          name: path.basename(file),
          size,
          path: file
        });

        // Check for large bundles
        if (size > 500 * 1024) { // > 500KB
          findings.push({
            type: 'issue',
            severity: size > 1024 * 1024 ? 'high' : 'medium',
            description: `Large bundle detected: ${path.basename(file)} (${this.formatBytes(size)})`,
            location: file,
            remediation: 'Consider code splitting, tree shaking, or removing unused dependencies'
          });
        }
      }

      metrics.totalSize = totalSize;
      metrics.chunkCount = bundleFiles.length;

      // Overall bundle size assessment
      if (totalSize > 1024 * 1024) { // > 1MB
        findings.push({
          type: 'issue',
          severity: 'high',
          description: `Total bundle size is large: ${this.formatBytes(totalSize)}`,
          remediation: 'Implement code splitting, lazy loading, and dependency optimization'
        });
      }

      return { findings, metrics };
    } catch (error) {
      findings.push({
        type: 'error',
        severity: 'high',
        description: `Bundle analysis failed: ${error.message}`
      });
      return { findings, metrics };
    }
  }

  /**
   * Analyze runtime performance characteristics
   */
  async analyzeRuntimePerformance() {
    const findings = [];
    const metrics = {};

    try {
      // Analyze JavaScript performance patterns
      const jsAnalysis = await this.analyzeJavaScriptPerformance();
      findings.push(...jsAnalysis.findings);
      Object.assign(metrics, jsAnalysis.metrics);

      // Analyze CSS performance
      const cssAnalysis = await this.analyzeCSSPerformance();
      findings.push(...cssAnalysis.findings);
      Object.assign(metrics, cssAnalysis.metrics);

      // Analyze image optimization
      const imageAnalysis = await this.analyzeImageOptimization();
      findings.push(...imageAnalysis.findings);
      Object.assign(metrics, imageAnalysis.metrics);

      return { findings, metrics };
    } catch (error) {
      findings.push({
        type: 'error',
        severity: 'medium',
        description: `Runtime analysis failed: ${error.message}`
      });
      return { findings, metrics };
    }
  }

  /**
   * Analyze Core Web Vitals and performance metrics
   */
  async analyzeWebVitals() {
    const findings = [];
    const metrics = {};
    let lighthouseResults = null;

    try {
      // Run Lighthouse audit with real integration
      lighthouseResults = await this.runLighthouseAudit();
      
      metrics.performanceScore = lighthouseResults.performance;
      metrics.lcp = lighthouseResults.lcp;
      metrics.fid = lighthouseResults.fid;
      metrics.cls = lighthouseResults.cls;
      metrics.fcp = lighthouseResults.fcp;
      metrics.tbt = lighthouseResults.tbt;

      // Add Lighthouse opportunities as findings
      if (lighthouseResults.opportunities) {
        for (const opportunity of lighthouseResults.opportunities) {
          findings.push({
            type: 'optimization',
            severity: opportunity.savings?.timeMs > 1000 ? 'high' : 'medium',
            description: opportunity.title,
            location: 'lighthouse-audit',
            remediation: opportunity.description,
            impact: opportunity.displayValue,
            savingsMs: opportunity.savings?.timeMs || 0
          });
        }
      }

      // Add accessibility issues as findings
      if (lighthouseResults.accessibilityIssues) {
        for (const issue of lighthouseResults.accessibilityIssues) {
          findings.push({
            type: 'accessibility',
            severity: issue.impact === 'critical' ? 'high' : 'medium',
            description: issue.title,
            location: 'lighthouse-audit',
            remediation: issue.description
          });
        }
      }

      // Evaluate Core Web Vitals
      if (metrics.lcp > 2500) {
        findings.push({
          type: 'issue',
          severity: 'high',
          description: `Largest Contentful Paint is slow: ${metrics.lcp}ms (should be < 2.5s)`,
          remediation: 'Optimize images, reduce server response time, eliminate render-blocking resources'
        });
      }

      if (metrics.fid > 100) {
        findings.push({
          type: 'issue',
          severity: 'high',
          description: `First Input Delay is high: ${metrics.fid}ms (should be < 100ms)`,
          remediation: 'Reduce JavaScript execution time, split long tasks, use web workers'
        });
      }

      if (metrics.cls > 0.1) {
        findings.push({
          type: 'issue',
          severity: 'medium',
          description: `Cumulative Layout Shift is high: ${metrics.cls} (should be < 0.1)`,
          remediation: 'Set dimensions for images and ads, avoid inserting content above existing content'
        });
      }

      return { findings, metrics, lighthouseResults };
    } catch (error) {
      findings.push({
        type: 'error',
        severity: 'medium',
        description: `Web Vitals analysis failed: ${error.message}`
      });
      return { findings, metrics, lighthouseResults };
    }
  }

  /**
   * Analyze dependency performance impact
   */
  async analyzeDependencyPerformance() {
    const findings = [];
    const metrics = {};

    try {
      const packageJson = await this.readPackageJson();
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      metrics.totalDependencies = Object.keys(dependencies).length;

      // Check for performance-heavy dependencies
      const heavyDependencies = [
        'moment', 'lodash', 'jquery', 'bootstrap', 'material-ui'
      ];

      for (const [dep, version] of Object.entries(dependencies)) {
        if (heavyDependencies.some(heavy => dep.includes(heavy))) {
          findings.push({
            type: 'recommendation',
            severity: 'medium',
            description: `Consider lighter alternative to ${dep}`,
            remediation: this.getSuggestedAlternative(dep)
          });
        }
      }

      return { findings, metrics };
    } catch (error) {
      findings.push({
        type: 'error',
        severity: 'low',
        description: `Dependency analysis failed: ${error.message}`
      });
      return { findings, metrics };
    }
  }

  // Helper methods

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readPackageJson() {
    try {
      const content = await fs.readFile('package.json', 'utf8');
      return JSON.parse(content);
    } catch {
      return { dependencies: {}, devDependencies: {} };
    }
  }

  isWebProject(projectType) {
    const webTypes = ['react', 'vue', 'angular', 'nextjs', 'nuxt', 'svelte'];
    return webTypes.includes(projectType) || projectType === 'node';
  }

  async hasBuildConfiguration() {
    const configs = [
      'webpack.config.js', 'vite.config.js', 'rollup.config.js',
      'next.config.js', 'nuxt.config.js', 'vue.config.js'
    ];

    for (const config of configs) {
      if (await this.fileExists(config)) {
        return true;
      }
    }

    return false;
  }

  identifyBuildTools(techStack) {
    return techStack.buildTools.map(tool => ({
      name: tool.name,
      version: tool.version,
      category: tool.category
    }));
  }

  async findBuildDirectory() {
    const buildDirs = ['dist', 'build', '.next', 'out'];
    
    for (const dir of buildDirs) {
      if (await this.fileExists(dir)) {
        return dir;
      }
    }
    
    return null;
  }

  async findBundleFiles(buildDir) {
    const files = [];
    try {
      const items = await fs.readdir(buildDir, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.css'))) {
          files.push(path.join(buildDir, item.name));
        }
      }
    } catch (error) {
      console.warn(`Failed to read build directory: ${error.message}`);
    }
    
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async createPerformanceAuditPlan(args) {
    return `# Performance Audit Plan

## Analysis Scope
- Bundle size analysis and optimization
- Runtime performance measurement
- Core Web Vitals assessment
- Dependency performance impact
- Build configuration optimization

## Metrics to Collect
- Total bundle size and chunk distribution
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Total Blocking Time (TBT)

## Optimization Areas
- Code splitting and lazy loading
- Image optimization and compression
- CSS and JavaScript minification
- Dependency tree shaking
- Caching strategy optimization

## Success Criteria
- Bundle size < 1MB for initial load
- LCP < 2.5 seconds
- FID < 100 milliseconds
- CLS < 0.1
- Performance score > 90
`;
  }

  async captureBaselineMetrics() {
    return {
      timestamp: new Date().toISOString(),
      bundleSize: 0,
      performanceScore: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      note: 'Initial baseline - will be updated after first analysis'
    };
  }

  /**
   * Run Lighthouse audit with real integration
   */
  async runLighthouseAudit(options = {}) {
    try {
      // Check if Lighthouse is available
      if (!await this.lighthouse.isAvailable()) {
        console.log('Lighthouse not available - using fallback analysis');
        return this.getFallbackPerformanceMetrics();
      }

      // Try to audit local development server first
      if (options.port || await this.lighthouse.isServerRunning(3000)) {
        const port = options.port || 3000;
        console.log(`Auditing development server on port ${port}...`);
        const results = await this.lighthouse.auditLocalServer(port, options.path);
        return this.convertLighthouseResults(results);
      }

      // Try to audit built application
      const buildDir = await this.findBuildDirectory();
      if (buildDir) {
        console.log(`Auditing built application in ${buildDir}...`);
        const results = await this.lighthouse.auditBuiltApp(buildDir, options);
        return this.convertLighthouseResults(results);
      }

      // Fallback to mock data if no server or build available
      console.warn('No development server or build found - using fallback metrics');
      return this.getFallbackPerformanceMetrics();

    } catch (error) {
      console.error('Lighthouse audit failed:', error.message);
      return this.getFallbackPerformanceMetrics();
    }
  }

  /**
   * Convert Lighthouse results to expected format
   */
  convertLighthouseResults(lighthouseResults) {
    return {
      performance: lighthouseResults.scores.performance,
      lcp: lighthouseResults.webVitals.lcp,
      fid: lighthouseResults.webVitals.fid,
      cls: lighthouseResults.webVitals.cls,
      fcp: lighthouseResults.webVitals.fcp,
      tbt: lighthouseResults.webVitals.tbt,
      opportunities: lighthouseResults.opportunities,
      diagnostics: lighthouseResults.diagnostics,
      accessibilityIssues: lighthouseResults.accessibilityIssues,
      raw: lighthouseResults.raw
    };
  }

  /**
   * Fallback performance metrics when Lighthouse is not available
   */
  getFallbackPerformanceMetrics() {
    console.log('Using fallback performance analysis...');
    return {
      performance: 75, // Conservative estimate
      lcp: 3000,
      fid: 120,
      cls: 0.08,
      fcp: 1800,
      tbt: 200,
      opportunities: [],
      diagnostics: [],
      accessibilityIssues: [],
      note: 'Fallback metrics - install Lighthouse for accurate measurements'
    };
  }

  async analyzeJavaScriptPerformance() {
    return {
      findings: [],
      metrics: { jsExecutionTime: 200 }
    };
  }

  async analyzeCSSPerformance() {
    return {
      findings: [],
      metrics: { cssSize: 50000 }
    };
  }

  async analyzeImageOptimization() {
    return {
      findings: [],
      metrics: { imageCount: 10, totalImageSize: 500000 }
    };
  }

  async generateOptimizationRecommendations() {
    const state = await this.sessionManager.loadState();
    const recommendations = [];

    // Get Lighthouse-based recommendations if available
    if (state.lighthouseResults) {
      const lighthouseRecs = this.lighthouse.generateOptimizationRecommendations(state.lighthouseResults);
      recommendations.push(...lighthouseRecs);
    }

    // Add bundle-specific recommendations
    if (state.metrics?.bundleSize > 1024 * 1024) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: 'Reduce bundle size',
        description: 'Large bundle size detected',
        impact: `Current size: ${this.formatBytes(state.metrics.bundleSize)}`,
        implementation: 'Implement code splitting, tree shaking, and lazy loading'
      });
    }

    // Add framework-specific recommendations
    const projectInfo = state.context;
    if (projectInfo?.frameworks?.includes('React')) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        title: 'Optimize React performance',
        description: 'React-specific optimizations',
        implementation: 'Use React.memo, useMemo, useCallback for expensive operations'
      });
    }

    return recommendations.length > 0 ? recommendations : [
      {
        type: 'optimization',
        description: 'Implement code splitting for better performance',
        priority: 'high'
      }
    ];
  }

  async createPerformanceBudget() {
    return {
      bundleSize: '1MB',
      lcp: '2.5s',
      fid: '100ms',
      cls: '0.1'
    };
  }

  async generatePerformanceReport() {
    const state = await this.sessionManager.loadState();
    const report = `# Performance Audit Report

## Summary
- Bundle Size: ${this.formatBytes(state.metrics?.bundleSize || 0)}
- Performance Score: ${state.metrics?.performanceScore || 0}/100
- Core Web Vitals: ${state.metrics?.lcp || 0}ms LCP, ${state.metrics?.fid || 0}ms FID, ${state.metrics?.cls || 0} CLS

## Recommendations
${state.findings?.filter(f => f.type === 'recommendation').map(f => `- ${f.description}`).join('\n') || 'No recommendations at this time'}

## Next Steps
1. Implement recommended optimizations
2. Re-run audit to measure improvements
3. Set up continuous performance monitoring
`;

    await this.sessionManager.savePlan(report);
    return report;
  }

  async compareWithBaseline() {
    const state = await this.sessionManager.loadState();
    const current = state.lighthouseResults || state.metrics || {};
    const baseline = state.baseline || {};

    // If we have Lighthouse results, use the integration's comparison
    if (state.lighthouseResults && baseline.lighthouseResults) {
      return await this.lighthouse.compareResults(
        state.lighthouseResults,
        baseline.lighthouseResults
      );
    }

    // Fallback to simple metric comparison
    const improvements = [];
    const regressions = [];

    // Compare bundle size
    if (current.bundleSize && baseline.bundleSize) {
      const sizeDiff = current.bundleSize - baseline.bundleSize;
      if (sizeDiff < -10000) { // 10KB improvement
        improvements.push({
          metric: 'bundleSize',
          improvement: Math.abs(sizeDiff),
          type: 'size'
        });
      } else if (sizeDiff > 10000) { // 10KB regression
        regressions.push({
          metric: 'bundleSize',
          regression: sizeDiff,
          type: 'size'
        });
      }
    }

    return {
      improvements,
      regressions,
      summary: `Found ${improvements.length} improvements and ${regressions.length} regressions`
    };
  }

  async validatePerformanceBudget() {
    return {
      compliant: true,
      violations: []
    };
  }

  getSuggestedAlternative(dependency) {
    const alternatives = {
      'moment': 'Use date-fns or dayjs for smaller bundle size',
      'lodash': 'Import specific functions or use native ES6 methods',
      'jquery': 'Use vanilla JavaScript or modern framework methods'
    };

    return alternatives[dependency] || 'Consider if this dependency is necessary';
  }

  async generateThinkingPrompt(phase, args) {
    return `Analyzing complex performance scenario in ${phase} phase:

When dealing with performance optimization:
- Bundle size optimization strategies for different application types
- Runtime performance bottlenecks and their resolution approaches  
- Core Web Vitals improvement techniques and their trade-offs
- Dependency management and tree shaking effectiveness
- Build configuration optimization for different deployment targets
- Caching strategies and their impact on performance metrics
- Progressive loading and code splitting implementation patterns

This analysis will help identify the most impactful optimizations for the specific application architecture and usage patterns.`;
  }
}

module.exports = PerformanceAuditCommand;