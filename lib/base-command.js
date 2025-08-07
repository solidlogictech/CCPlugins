const fs = require('fs').promises;
const path = require('path');
const ExtendedThinking = require('./core/extended-thinking');

/**
 * Base Command Class for Advanced Web Development Commands
 * 
 * Provides common functionality including session management,
 * extended thinking capabilities, and 5-phase execution pattern.
 */
class BaseCommand {
  constructor(commandName) {
    this.commandName = commandName;
    this.sessionDir = commandName;
    this.extendedThinking = new ExtendedThinking();
    this.phases = [
      'setup',
      'discovery', 
      'analysis',
      'execution',
      'validation'
    ];
    this.currentPhase = 'setup';
  }

  /**
   * Initialize session directory and check for existing sessions
   */
  async initializeSession() {
    try {
      await fs.access(this.sessionDir);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(this.sessionDir, { recursive: true });
    }
  }

  /**
   * Load existing session state
   */
  async loadSession() {
    try {
      const statePath = path.join(this.sessionDir, 'state.json');
      const stateData = await fs.readFile(statePath, 'utf8');
      return JSON.parse(stateData);
    } catch (error) {
      return null;
    }
  }

  /**
   * Save session state
   */
  async saveSession(sessionState) {
    const statePath = path.join(this.sessionDir, 'state.json');
    await fs.writeFile(statePath, JSON.stringify(sessionState, null, 2), 'utf8');
  }

  /**
   * Execute the 5-phase command pattern
   */
  async executePhases(context = {}) {
    const results = {
      phases: {},
      extendedAnalysis: null,
      sessionState: null
    };

    try {
      // Phase 1: Setup & Analysis
      this.currentPhase = 'setup';
      results.phases.setup = await this.phaseSetup(context);

      // Phase 2: Pattern Discovery
      this.currentPhase = 'discovery';
      results.phases.discovery = await this.phaseDiscovery(context, results.phases.setup);

      // Check if extended thinking is required
      const complexityAssessment = this.extendedThinking.assessComplexity(
        this.commandName, 
        { ...context, ...results.phases.discovery }
      );

      if (complexityAssessment.requiresExtendedThinking) {
        results.extendedAnalysis = await this.extendedThinking.performExtendedAnalysis(
          this.commandName,
          context,
          complexityAssessment.triggers
        );
      }

      // Phase 3: Deep Analysis
      this.currentPhase = 'analysis';
      results.phases.analysis = await this.phaseAnalysis(
        context, 
        results.phases.discovery,
        results.extendedAnalysis
      );

      // Phase 4: Execution/Generation
      this.currentPhase = 'execution';
      results.phases.execution = await this.phaseExecution(
        context,
        results.phases.analysis,
        results.extendedAnalysis
      );

      // Phase 5: Integration & Validation
      this.currentPhase = 'validation';
      results.phases.validation = await this.phaseValidation(
        context,
        results.phases.execution
      );

      // Create and save session state
      results.sessionState = this.createSessionState(context, results);
      await this.saveSession(results.sessionState);

      return results;

    } catch (error) {
      return this.handlePhaseError(error, this.currentPhase);
    }
  }

  /**
   * Phase 1: Initial Setup & Analysis
   * Override in subclasses for command-specific setup
   */
  async phaseSetup(context) {
    return {
      phase: 'setup',
      timestamp: new Date().toISOString(),
      context: context,
      status: 'completed'
    };
  }

  /**
   * Phase 2: Pattern Discovery
   * Override in subclasses for technology/framework detection
   */
  async phaseDiscovery(context, setupResults) {
    return {
      phase: 'discovery',
      timestamp: new Date().toISOString(),
      patterns: [],
      technologies: [],
      frameworks: [],
      status: 'completed'
    };
  }

  /**
   * Phase 3: Deep Analysis
   * Override in subclasses for core functionality analysis
   */
  async phaseAnalysis(context, discoveryResults, extendedAnalysis) {
    return {
      phase: 'analysis',
      timestamp: new Date().toISOString(),
      findings: [],
      recommendations: [],
      metrics: {},
      extendedInsights: extendedAnalysis?.deepInsights || [],
      status: 'completed'
    };
  }

  /**
   * Phase 4: Execution/Generation
   * Override in subclasses for implementation/generation
   */
  async phaseExecution(context, analysisResults, extendedAnalysis) {
    return {
      phase: 'execution',
      timestamp: new Date().toISOString(),
      actions: [],
      generated: [],
      applied: [],
      status: 'completed'
    };
  }

  /**
   * Phase 5: Integration & Validation
   * Override in subclasses for quality assurance
   */
  async phaseValidation(context, executionResults) {
    return {
      phase: 'validation',
      timestamp: new Date().toISOString(),
      validations: [],
      integrations: [],
      status: 'completed'
    };
  }

  /**
   * Create session state from execution results
   */
  createSessionState(context, results) {
    return {
      sessionId: Date.now().toString(),
      command: this.commandName,
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      phase: 'complete',
      progress: {
        totalSteps: this.phases.length,
        completedSteps: this.phases.length,
        currentStep: 'All phases completed'
      },
      context: {
        ...context,
        hasExtendedAnalysis: !!results.extendedAnalysis
      },
      findings: this.extractFindings(results),
      metrics: this.extractMetrics(results),
      extendedAnalysis: results.extendedAnalysis
    };
  }

  /**
   * Extract findings from all phases
   */
  extractFindings(results) {
    const findings = [];
    
    Object.values(results.phases).forEach(phase => {
      if (phase.findings) {
        findings.push(...phase.findings);
      }
    });

    return findings;
  }

  /**
   * Extract metrics from all phases
   */
  extractMetrics(results) {
    const metrics = {};
    
    Object.values(results.phases).forEach(phase => {
      if (phase.metrics) {
        Object.assign(metrics, phase.metrics);
      }
    });

    return metrics;
  }

  /**
   * Handle errors during phase execution
   */
  handlePhaseError(error, phase) {
    return {
      error: true,
      phase: phase,
      message: error.message,
      timestamp: new Date().toISOString(),
      recovery: this.suggestRecovery(error, phase)
    };
  }

  /**
   * Suggest recovery strategies for errors
   */
  suggestRecovery(error, phase) {
    const recoveryStrategies = {
      setup: [
        'Check if required tools are installed',
        'Verify project directory permissions',
        'Ensure project is in correct format'
      ],
      discovery: [
        'Try running in a different project directory',
        'Check if project has required configuration files',
        'Verify framework/technology detection patterns'
      ],
      analysis: [
        'Reduce analysis scope if project is too large',
        'Check for corrupted or inaccessible files',
        'Try running with different analysis parameters'
      ],
      execution: [
        'Verify write permissions for generated files',
        'Check for conflicts with existing files',
        'Ensure all dependencies are available'
      ],
      validation: [
        'Check generated files for syntax errors',
        'Verify integration points are accessible',
        'Run validation with reduced scope'
      ]
    };

    return recoveryStrategies[phase] || ['Retry the operation', 'Check system requirements'];
  }

  /**
   * Generate comprehensive report
   */
  async generateReport(results) {
    const report = this.formatReport(results);
    const reportPath = path.join(this.sessionDir, 'report.md');
    await fs.writeFile(reportPath, report, 'utf8');
    return reportPath;
  }

  /**
   * Format execution results into markdown report
   */
  formatReport(results) {
    const timestamp = new Date().toISOString();
    
    return `# ${this.commandName.toUpperCase()} Analysis Report

Generated: ${timestamp}

## Executive Summary

${this.generateExecutiveSummary(results)}

## Phase Results

${this.formatPhaseResults(results.phases)}

${results.extendedAnalysis ? this.formatExtendedAnalysis(results.extendedAnalysis) : ''}

## Findings Summary

${this.formatFindings(results)}

## Metrics

${this.formatMetrics(results)}

## Next Steps

${this.generateNextSteps(results)}
`;
  }

  generateExecutiveSummary(results) {
    const findings = this.extractFindings(results);
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const highCount = findings.filter(f => f.severity === 'high').length;
    
    return `Analysis completed successfully with ${findings.length} findings identified.
- Critical issues: ${criticalCount}
- High priority items: ${highCount}
- Extended analysis: ${results.extendedAnalysis ? 'Performed' : 'Not required'}`;
  }

  formatPhaseResults(phases) {
    return Object.entries(phases).map(([phaseName, phaseResult]) => {
      return `### ${phaseName.charAt(0).toUpperCase() + phaseName.slice(1)} Phase
- Status: ${phaseResult.status}
- Completed: ${phaseResult.timestamp}
${phaseResult.findings ? `- Findings: ${phaseResult.findings.length}` : ''}
${phaseResult.recommendations ? `- Recommendations: ${phaseResult.recommendations.length}` : ''}`;
    }).join('\n\n');
  }

  formatExtendedAnalysis(extendedAnalysis) {
    return `## Extended Analysis

### Complexity Assessment
- Level: ${extendedAnalysis.complexityAssessment.level}
- Triggers: ${extendedAnalysis.complexityAssessment.triggers}
- Approach: ${extendedAnalysis.complexityAssessment.approach}

### Deep Insights
${extendedAnalysis.deepInsights.map(insight => 
  `- **${insight.category}**: ${insight.insight} (Impact: ${insight.impact})`
).join('\n')}

### Strategic Recommendations
${extendedAnalysis.strategicRecommendations.map(rec => 
  `- **${rec.category}** (${rec.priority}): ${rec.recommendation}`
).join('\n')}

### Implementation Plan
${extendedAnalysis.implementationPlan.phases.map(phase => 
  `- **${phase.name}** (${phase.duration}): ${phase.description}`
).join('\n')}

**Total Estimated Time**: ${extendedAnalysis.implementationPlan.totalEstimatedTime}
**Risk Level**: ${extendedAnalysis.implementationPlan.riskLevel}
`;
  }

  formatFindings(results) {
    const findings = this.extractFindings(results);
    if (findings.length === 0) return 'No significant findings identified.';
    
    const grouped = findings.reduce((acc, finding) => {
      acc[finding.severity] = acc[finding.severity] || [];
      acc[finding.severity].push(finding);
      return acc;
    }, {});

    return Object.entries(grouped).map(([severity, items]) => {
      return `### ${severity.charAt(0).toUpperCase() + severity.slice(1)} Priority
${items.map(item => `- ${item.description} (${item.location || 'General'})`).join('\n')}`;
    }).join('\n\n');
  }

  formatMetrics(results) {
    const metrics = this.extractMetrics(results);
    if (Object.keys(metrics).length === 0) return 'No metrics collected.';
    
    return Object.entries(metrics).map(([key, value]) => {
      return `- **${key}**: ${value}`;
    }).join('\n');
  }

  generateNextSteps(results) {
    const steps = [
      'Review the detailed findings and recommendations',
      'Prioritize high and critical severity items',
      'Implement suggested improvements incrementally'
    ];

    if (results.extendedAnalysis) {
      steps.push('Follow the strategic implementation plan');
      steps.push('Monitor success metrics during implementation');
    }

    return steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  }

  /**
   * Handle general command errors
   */
  handleError(error) {
    return `
❌ **${this.commandName.toUpperCase()} Error**

**Error**: ${error.message}
**Phase**: ${this.currentPhase}
**Time**: ${new Date().toISOString()}

**Recovery Suggestions**:
${this.suggestRecovery(error, this.currentPhase).map(s => `- ${s}`).join('\n')}

**Session**: Check \`${this.sessionDir}/\` for partial results
`;
  }
}

module.exports = BaseCommand;