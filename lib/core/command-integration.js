/**
 * Cross-Command Integration and Workflow System
 * 
 * Enables commands to work together, share context, and suggest
 * complementary actions for comprehensive project health management.
 */

const fs = require('fs').promises;
const path = require('path');

class CommandIntegration {
  constructor() {
    this.sharedContextPath = '.kiro/shared-context.json';
    this.workflowHistoryPath = '.kiro/workflow-history.json';
    this.commandSuggestions = new Map();
    this.contextExchangeRules = new Map();
    
    this.initializeIntegrationRules();
  }

  /**
   * Initialize rules for command integration and suggestions
   */
  initializeIntegrationRules() {
    // Performance audit integrations
    this.contextExchangeRules.set('performance-audit', {
      provides: ['bundleSize', 'loadTimes', 'performanceMetrics', 'optimizationNeeds'],
      consumes: ['architecturePatterns', 'deploymentConfig', 'monitoringSetup'],
      suggests: ['docker-optimize', 'monitoring-setup', 'architecture-analysis']
    });

    // Accessibility scan integrations
    this.contextExchangeRules.set('accessibility-scan', {
      provides: ['accessibilityViolations', 'wcagCompliance', 'ariaIssues'],
      consumes: ['componentLibrary', 'i18nSupport', 'visualRegressionBaselines'],
      suggests: ['visual-regression', 'i18n-extract', 'architecture-analysis']
    });

    // Architecture analysis integrations
    this.contextExchangeRules.set('architecture-analysis', {
      provides: ['architecturePatterns', 'technicalDebt', 'complexityMetrics', 'dependencyGraph'],
      consumes: ['performanceMetrics', 'testCoverage', 'deploymentPatterns'],
      suggests: ['performance-audit', 'database-optimize', 'git-workflow']
    });

    // Database optimize integrations
    this.contextExchangeRules.set('database-optimize', {
      provides: ['queryPerformance', 'indexOptimizations', 'migrationRisks'],
      consumes: ['architecturePatterns', 'performanceMetrics', 'monitoringSetup'],
      suggests: ['monitoring-setup', 'performance-audit', 'architecture-analysis']
    });

    // Docker optimize integrations
    this.contextExchangeRules.set('docker-optimize', {
      provides: ['containerConfig', 'deploymentReadiness', 'securityScans'],
      consumes: ['performanceMetrics', 'monitoringSetup', 'architecturePatterns'],
      suggests: ['monitoring-setup', 'performance-audit', 'git-workflow']
    });

    // API docs integrations
    this.contextExchangeRules.set('api-docs', {
      provides: ['apiSpecification', 'endpointCoverage', 'breakingChanges'],
      consumes: ['architecturePatterns', 'testCoverage', 'deploymentConfig'],
      suggests: ['architecture-analysis', 'monitoring-setup', 'git-workflow']
    });

    // Monitoring setup integrations
    this.contextExchangeRules.set('monitoring-setup', {
      provides: ['observabilityConfig', 'alertingRules', 'dashboardConfig'],
      consumes: ['performanceMetrics', 'deploymentConfig', 'errorPatterns'],
      suggests: ['performance-audit', 'docker-optimize', 'git-workflow']
    });

    // Visual regression integrations
    this.contextExchangeRules.set('visual-regression', {
      provides: ['visualBaselines', 'uiComponents', 'crossBrowserResults'],
      consumes: ['accessibilityViolations', 'i18nSupport', 'componentLibrary'],
      suggests: ['accessibility-scan', 'i18n-extract', 'performance-audit']
    });

    // i18n extract integrations
    this.contextExchangeRules.set('i18n-extract', {
      provides: ['translationCoverage', 'localeSupport', 'i18nPatterns'],
      consumes: ['componentLibrary', 'visualBaselines', 'accessibilityViolations'],
      suggests: ['visual-regression', 'accessibility-scan', 'architecture-analysis']
    });

    // Git workflow integrations
    this.contextExchangeRules.set('git-workflow', {
      provides: ['workflowPatterns', 'collaborationMetrics', 'releaseProcess'],
      consumes: ['deploymentConfig', 'testCoverage', 'architecturePatterns'],
      suggests: ['docker-optimize', 'monitoring-setup', 'api-docs']
    });
  }

  /**
   * Share context data between commands
   */
  async shareContext(commandName, contextData) {
    try {
      const sharedContext = await this.loadSharedContext();
      
      sharedContext[commandName] = {
        ...contextData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      await this.saveSharedContext(sharedContext);
      
      // Update workflow history
      await this.updateWorkflowHistory(commandName, 'context-shared', contextData);
      
      return true;
    } catch (error) {
      console.error('Failed to share context:', error);
      return false;
    }
  }

  /**
   * Retrieve shared context from other commands
   */
  async getSharedContext(requestingCommand, requiredContextTypes = []) {
    try {
      const sharedContext = await this.loadSharedContext();
      const relevantContext = {};

      // Get context based on integration rules
      const rules = this.contextExchangeRules.get(requestingCommand);
      if (rules && rules.consumes) {
        for (const [commandName, contextData] of Object.entries(sharedContext)) {
          if (commandName !== requestingCommand) {
            const commandRules = this.contextExchangeRules.get(commandName);
            if (commandRules && commandRules.provides) {
              // Check if this command provides what we need
              const intersection = rules.consumes.filter(item => 
                commandRules.provides.includes(item)
              );
              
              if (intersection.length > 0) {
                relevantContext[commandName] = {
                  data: contextData,
                  provides: intersection
                };
              }
            }
          }
        }
      }

      // Filter by specific required types if provided
      if (requiredContextTypes.length > 0) {
        const filteredContext = {};
        for (const [commandName, context] of Object.entries(relevantContext)) {
          const matchingTypes = context.provides.filter(type => 
            requiredContextTypes.includes(type)
          );
          if (matchingTypes.length > 0) {
            filteredContext[commandName] = {
              ...context,
              provides: matchingTypes
            };
          }
        }
        return filteredContext;
      }

      return relevantContext;
    } catch (error) {
      console.error('Failed to get shared context:', error);
      return {};
    }
  }

  /**
   * Generate intelligent command suggestions based on current context
   */
  async generateCommandSuggestions(currentCommand, analysisResults) {
    const suggestions = [];
    
    try {
      const rules = this.contextExchangeRules.get(currentCommand);
      if (!rules || !rules.suggests) {
        return suggestions;
      }

      const sharedContext = await this.loadSharedContext();
      const workflowHistory = await this.loadWorkflowHistory();

      // Generate suggestions based on integration rules
      for (const suggestedCommand of rules.suggests) {
        const suggestion = await this.evaluateCommandSuggestion(
          currentCommand,
          suggestedCommand,
          analysisResults,
          sharedContext,
          workflowHistory
        );
        
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }

      // Sort suggestions by priority and relevance
      suggestions.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      return suggestions.slice(0, 5); // Return top 5 suggestions
    } catch (error) {
      console.error('Failed to generate command suggestions:', error);
      return [];
    }
  }

  /**
   * Evaluate a specific command suggestion
   */
  async evaluateCommandSuggestion(currentCommand, suggestedCommand, analysisResults, sharedContext, workflowHistory) {
    // Check if command was recently run
    const recentRun = workflowHistory.commands?.[suggestedCommand]?.lastRun;
    if (recentRun) {
      const timeSinceRun = Date.now() - new Date(recentRun).getTime();
      const daysSinceRun = timeSinceRun / (1000 * 60 * 60 * 24);
      
      // Don't suggest if run within last day unless high priority
      if (daysSinceRun < 1) {
        return null;
      }
    }

    // Generate suggestion based on current command and analysis results
    const suggestion = this.generateSpecificSuggestion(
      currentCommand,
      suggestedCommand,
      analysisResults,
      sharedContext
    );

    return suggestion;
  }

  /**
   * Generate specific suggestion based on command combination
   */
  generateSpecificSuggestion(currentCommand, suggestedCommand, analysisResults, sharedContext) {
    const suggestionMap = {
      'performance-audit': {
        'docker-optimize': {
          condition: () => analysisResults.bundleSize > 1024 * 1024, // > 1MB
          priority: 'high',
          reason: 'Large bundle size detected - container optimization can improve deployment efficiency',
          expectedBenefit: 'Reduced container size and faster deployments'
        },
        'monitoring-setup': {
          condition: () => analysisResults.performanceIssues?.length > 0,
          priority: 'medium',
          reason: 'Performance issues found - monitoring will help track improvements',
          expectedBenefit: 'Real-time performance monitoring and alerting'
        }
      },
      'accessibility-scan': {
        'visual-regression': {
          condition: () => analysisResults.violations?.length > 10,
          priority: 'high',
          reason: 'Multiple accessibility violations - visual testing can prevent regressions',
          expectedBenefit: 'Automated detection of accessibility regressions'
        },
        'i18n-extract': {
          condition: () => analysisResults.ariaIssues?.some(issue => issue.type === 'missing-labels'),
          priority: 'medium',
          reason: 'Missing ARIA labels detected - internationalization may be needed',
          expectedBenefit: 'Proper localization with accessibility support'
        }
      },
      'git-workflow': {
        'docker-optimize': {
          condition: () => analysisResults.teamSize > 10,
          priority: 'medium',
          reason: 'Large team detected - containerization can standardize development environment',
          expectedBenefit: 'Consistent development and deployment environments'
        },
        'monitoring-setup': {
          condition: () => analysisResults.releaseFrequency === 'high',
          priority: 'high',
          reason: 'High release frequency - monitoring is crucial for deployment safety',
          expectedBenefit: 'Automated deployment monitoring and rollback capabilities'
        }
      }
    };

    const commandSuggestions = suggestionMap[currentCommand];
    if (!commandSuggestions || !commandSuggestions[suggestedCommand]) {
      return null;
    }

    const suggestionConfig = commandSuggestions[suggestedCommand];
    
    // Check if condition is met
    if (suggestionConfig.condition && !suggestionConfig.condition()) {
      return null;
    }

    return {
      command: suggestedCommand,
      priority: suggestionConfig.priority,
      reason: suggestionConfig.reason,
      expectedBenefit: suggestionConfig.expectedBenefit,
      confidence: this.calculateSuggestionConfidence(currentCommand, suggestedCommand, analysisResults)
    };
  }

  /**
   * Calculate confidence score for a suggestion
   */
  calculateSuggestionConfidence(currentCommand, suggestedCommand, analysisResults) {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on analysis results
    if (analysisResults.findings?.length > 5) confidence += 0.2;
    if (analysisResults.extendedAnalysis) confidence += 0.2;
    if (analysisResults.metrics && Object.keys(analysisResults.metrics).length > 3) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Create automated workflow chains
   */
  async createWorkflowChain(commands, options = {}) {
    const chain = {
      id: Date.now().toString(),
      commands: commands,
      options: options,
      status: 'pending',
      results: {},
      createdAt: new Date().toISOString()
    };

    try {
      // Validate command chain
      const validation = await this.validateWorkflowChain(commands);
      if (!validation.valid) {
        throw new Error(`Invalid workflow chain: ${validation.errors.join(', ')}`);
      }

      // Save workflow chain
      await this.saveWorkflowChain(chain);
      
      return {
        success: true,
        chainId: chain.id,
        estimatedDuration: validation.estimatedDuration,
        dependencies: validation.dependencies
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute a workflow chain
   */
  async executeWorkflowChain(chainId) {
    try {
      const chain = await this.loadWorkflowChain(chainId);
      if (!chain) {
        throw new Error('Workflow chain not found');
      }

      const results = {};
      let sharedContext = {};

      for (const commandConfig of chain.commands) {
        const { command, args = '', dependencies = [] } = commandConfig;
        
        // Wait for dependencies
        for (const dep of dependencies) {
          if (!results[dep] || results[dep].status !== 'completed') {
            throw new Error(`Dependency ${dep} not completed`);
          }
        }

        // Execute command with shared context
        const commandResult = await this.executeCommandWithContext(
          command, 
          args, 
          sharedContext
        );
        
        results[command] = commandResult;
        
        // Update shared context
        if (commandResult.context) {
          sharedContext = { ...sharedContext, ...commandResult.context };
        }
      }

      // Update chain status
      chain.status = 'completed';
      chain.results = results;
      chain.completedAt = new Date().toISOString();
      
      await this.saveWorkflowChain(chain);
      
      return {
        success: true,
        results: results,
        summary: this.generateChainSummary(chain)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate comprehensive project health dashboard
   */
  async generateProjectHealthDashboard() {
    try {
      const sharedContext = await this.loadSharedContext();
      const workflowHistory = await this.loadWorkflowHistory();
      
      const dashboard = {
        timestamp: new Date().toISOString(),
        overallHealth: 'unknown',
        categories: {},
        recommendations: [],
        trends: {},
        lastUpdated: {}
      };

      // Analyze each category
      dashboard.categories.performance = this.analyzePerformanceHealth(sharedContext);
      dashboard.categories.accessibility = this.analyzeAccessibilityHealth(sharedContext);
      dashboard.categories.architecture = this.analyzeArchitectureHealth(sharedContext);
      dashboard.categories.deployment = this.analyzeDeploymentHealth(sharedContext);
      dashboard.categories.monitoring = this.analyzeMonitoringHealth(sharedContext);
      dashboard.categories.testing = this.analyzeTestingHealth(sharedContext);
      dashboard.categories.workflow = this.analyzeWorkflowHealth(sharedContext);

      // Calculate overall health
      dashboard.overallHealth = this.calculateOverallHealth(dashboard.categories);
      
      // Generate recommendations
      dashboard.recommendations = await this.generateHealthRecommendations(dashboard.categories);
      
      // Analyze trends
      dashboard.trends = this.analyzeTrends(workflowHistory);
      
      // Save dashboard
      await this.saveDashboard(dashboard);
      
      return dashboard;
    } catch (error) {
      console.error('Failed to generate project health dashboard:', error);
      return null;
    }
  }

  // Helper methods for dashboard generation
  analyzePerformanceHealth(sharedContext) {
    const perfData = sharedContext['performance-audit'];
    if (!perfData) return { status: 'unknown', score: 0, message: 'No performance data available' };
    
    const bundleSize = perfData.bundleSize || 0;
    const loadTime = perfData.loadTime || 0;
    
    let score = 100;
    if (bundleSize > 1024 * 1024) score -= 30; // > 1MB
    if (loadTime > 3000) score -= 40; // > 3s
    
    return {
      status: score > 80 ? 'good' : score > 60 ? 'warning' : 'critical',
      score: Math.max(score, 0),
      message: `Bundle: ${(bundleSize / 1024 / 1024).toFixed(2)}MB, Load: ${loadTime}ms`
    };
  }

  analyzeAccessibilityHealth(sharedContext) {
    const a11yData = sharedContext['accessibility-scan'];
    if (!a11yData) return { status: 'unknown', score: 0, message: 'No accessibility data available' };
    
    const violations = a11yData.violations || 0;
    const compliance = a11yData.wcagCompliance || 0;
    
    return {
      status: compliance > 95 ? 'good' : compliance > 80 ? 'warning' : 'critical',
      score: compliance,
      message: `${violations} violations, ${compliance}% WCAG compliant`
    };
  }

  calculateOverallHealth(categories) {
    const scores = Object.values(categories)
      .filter(cat => cat.status !== 'unknown')
      .map(cat => cat.score);
    
    if (scores.length === 0) return 'unknown';
    
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    if (avgScore > 80) return 'good';
    if (avgScore > 60) return 'warning';
    return 'critical';
  }

  // File I/O helper methods
  async loadSharedContext() {
    try {
      const data = await fs.readFile(this.sharedContextPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  async saveSharedContext(context) {
    await fs.mkdir(path.dirname(this.sharedContextPath), { recursive: true });
    await fs.writeFile(this.sharedContextPath, JSON.stringify(context, null, 2), 'utf8');
  }

  async loadWorkflowHistory() {
    try {
      const data = await fs.readFile(this.workflowHistoryPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { commands: {}, chains: {} };
    }
  }

  async updateWorkflowHistory(commandName, action, data) {
    const history = await this.loadWorkflowHistory();
    
    if (!history.commands[commandName]) {
      history.commands[commandName] = { runs: [], lastRun: null };
    }
    
    history.commands[commandName].runs.push({
      action,
      timestamp: new Date().toISOString(),
      data
    });
    history.commands[commandName].lastRun = new Date().toISOString();
    
    await fs.mkdir(path.dirname(this.workflowHistoryPath), { recursive: true });
    await fs.writeFile(this.workflowHistoryPath, JSON.stringify(history, null, 2), 'utf8');
  }
}

module.exports = CommandIntegration;