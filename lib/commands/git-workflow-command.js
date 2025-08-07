const BaseCommand = require('../base-command');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class GitWorkflowCommand extends BaseCommand {
  constructor() {
    super('git-workflow');
  }

  async execute(args = '') {
    try {
      await this.initializeSession();
      
      // Parse arguments
      const options = this.parseArguments(args);
      
      // Check for existing session
      const existingSession = await this.loadSession();
      if (existingSession && !options.force && !options.resume) {
        return await this.resumeSession(existingSession);
      }

      // Execute using 5-phase pattern
      const results = await this.executePhases(options);
      
      if (results.error) {
        return this.handleError(new Error(results.message));
      }

      // Generate report
      await this.generateReport(results);
      
      return this.formatFinalOutput(results, options);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Override base class phases for Git workflow specific implementation
  async phaseSetup(context) {
    const setupResult = await super.phaseSetup(context);
    
    // Git-specific setup
    setupResult.gitAvailable = await this.checkGitAvailability();
    setupResult.repositoryValid = await this.validateRepository();
    
    return setupResult;
  }

  async phaseDiscovery(context, setupResults) {
    const discoveryResult = await super.phaseDiscovery(context, setupResults);
    
    if (!setupResults.gitAvailable || !setupResults.repositoryValid) {
      discoveryResult.error = 'Git repository not available or invalid';
      return discoveryResult;
    }

    // Discover Git workflow patterns
    discoveryResult.repository = await this.analyzeRepository();
    discoveryResult.branches = await this.analyzeBranches();
    discoveryResult.workflow = await this.detectWorkflowType();
    discoveryResult.teamPatterns = await this.analyzeTeamPatterns();
    
    // Set context for extended thinking assessment
    discoveryResult.teamSize = discoveryResult.teamPatterns?.totalAuthors || 0;
    discoveryResult.branchCount = discoveryResult.branches?.total || 0;
    discoveryResult.releaseComplexity = this.assessReleaseComplexity(discoveryResult);
    discoveryResult.complianceRequirements = this.detectComplianceRequirements(discoveryResult);
    
    return discoveryResult;
  }

  async phaseAnalysis(context, discoveryResults, extendedAnalysis) {
    const analysisResult = await super.phaseAnalysis(context, discoveryResults, extendedAnalysis);
    
    // Perform detailed Git workflow analysis
    analysisResult.commits = await this.analyzeCommits();
    analysisResult.mergePatterns = await this.analyzeMergePatterns();
    analysisResult.conflicts = await this.analyzeConflicts();
    
    // Generate findings
    analysisResult.findings = this.generateWorkflowFindings(discoveryResults, analysisResult);
    analysisResult.recommendations = this.generateWorkflowRecommendations(discoveryResults, analysisResult, extendedAnalysis);
    analysisResult.metrics = this.extractWorkflowMetrics(discoveryResults, analysisResult);
    
    return analysisResult;
  }

  async phaseExecution(context, analysisResults, extendedAnalysis) {
    const executionResult = await super.phaseExecution(context, analysisResults, extendedAnalysis);
    
    // Generate workflow optimization artifacts
    executionResult.optimizations = await this.generateOptimizations(analysisResults, extendedAnalysis);
    executionResult.configurations = await this.generateConfigurations(analysisResults);
    executionResult.documentation = await this.generateDocumentation(analysisResults);
    
    return executionResult;
  }

  async phaseValidation(context, executionResults) {
    const validationResult = await super.phaseValidation(context, executionResults);
    
    // Validate generated optimizations
    validationResult.validations = await this.validateOptimizations(executionResults);
    validationResult.integrations = await this.validateIntegrations(executionResults);
    
    return validationResult;
  }

  parseArguments(args) {
    const options = {
      focus: 'complete',
      force: false,
      analyze: false,
      optimize: false,
      resume: false
    };

    if (args.includes('--force')) options.force = true;
    if (args.includes('analyze')) options.analyze = true;
    if (args.includes('optimize')) options.optimize = true;
    if (args.includes('resume')) options.resume = true;
    if (args.includes('branches/')) options.focus = 'branches';
    if (args.includes('--conflicts')) options.focus = 'conflicts';
    if (args.includes('--releases')) options.focus = 'releases';

    return options;
  }

  async checkGitAvailability() {
    try {
      execSync('git --version', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async validateRepository() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  assessReleaseComplexity(discoveryResults) {
    const branchCount = discoveryResults.branches?.total || 0;
    const hasReleaseBranches = discoveryResults.branches?.patterns?.release > 0;
    const hasHotfixBranches = discoveryResults.branches?.patterns?.hotfix > 0;
    
    if (branchCount > 20 && hasReleaseBranches && hasHotfixBranches) {
      return 'high';
    } else if (branchCount > 10 && (hasReleaseBranches || hasHotfixBranches)) {
      return 'medium';
    }
    return 'low';
  }

  detectComplianceRequirements(discoveryResults) {
    // Check for compliance indicators in branch names, commit messages, etc.
    const branches = discoveryResults.branches?.branches || [];
    const hasComplianceBranches = branches.some(b => 
      b.includes('compliance') || 
      b.includes('audit') || 
      b.includes('security')
    );
    
    return hasComplianceBranches;
  }

  generateWorkflowFindings(discoveryResults, analysisResults) {
    const findings = [];
    
    // Branch analysis findings
    if (discoveryResults.branches?.patterns?.feature === 0) {
      findings.push({
        id: 'no-feature-branches',
        type: 'recommendation',
        severity: 'medium',
        description: 'No feature branches detected',
        location: 'Branch structure',
        remediation: 'Consider implementing feature branch workflow',
        status: 'pending'
      });
    }
    
    // Commit message findings
    if (analysisResults.commits?.messagePatterns?.conventionalPercentage < 50) {
      findings.push({
        id: 'inconsistent-commit-messages',
        type: 'issue',
        severity: 'low',
        description: 'Inconsistent commit message format',
        location: 'Commit history',
        remediation: 'Implement conventional commit format',
        status: 'pending'
      });
    }
    
    // Conflict findings
    if (analysisResults.conflicts?.recentConflicts > 5) {
      findings.push({
        id: 'frequent-conflicts',
        type: 'issue',
        severity: 'high',
        description: 'Frequent merge conflicts detected',
        location: 'Merge history',
        remediation: 'Review branching strategy and integration frequency',
        status: 'pending'
      });
    }
    
    return findings;
  }

  generateWorkflowRecommendations(discoveryResults, analysisResults, extendedAnalysis) {
    const recommendations = [];
    
    if (discoveryResults.workflow?.type === 'Custom' || discoveryResults.workflow?.confidence === 'low') {
      recommendations.push({
        priority: 'medium',
        category: 'workflow',
        recommendation: 'Adopt standardized workflow (GitHub Flow or GitFlow)',
        rationale: 'Standardized workflows improve team collaboration and reduce confusion',
        implementation: 'Choose appropriate workflow based on team size and release frequency'
      });
    }
    
    if (analysisResults.commits?.messagePatterns?.conventionalPercentage < 50) {
      recommendations.push({
        priority: 'low',
        category: 'commits',
        recommendation: 'Implement conventional commit message format',
        rationale: 'Consistent commit messages enable automated changelog generation',
        implementation: 'Set up commit message templates and validation hooks'
      });
    }
    
    // Add extended analysis recommendations
    if (extendedAnalysis?.strategicRecommendations) {
      recommendations.push(...extendedAnalysis.strategicRecommendations);
    }
    
    return recommendations;
  }

  extractWorkflowMetrics(discoveryResults, analysisResults) {
    return {
      totalBranches: discoveryResults.branches?.total || 0,
      totalCommits: analysisResults.commits?.total || 0,
      totalAuthors: discoveryResults.teamPatterns?.totalAuthors || 0,
      recentConflicts: analysisResults.conflicts?.recentConflicts || 0,
      conventionalCommitPercentage: parseFloat(analysisResults.commits?.messagePatterns?.conventionalPercentage) || 0,
      workflowConfidence: discoveryResults.workflow?.confidence === 'high' ? 100 : 
                         discoveryResults.workflow?.confidence === 'medium' ? 70 : 30
    };
  }

  async generateOptimizations(analysisResults, extendedAnalysis) {
    const optimizations = [];
    
    // Generate workflow-specific optimizations
    if (analysisResults.findings.some(f => f.id === 'frequent-conflicts')) {
      optimizations.push({
        type: 'conflict-reduction',
        description: 'Implement conflict reduction strategies',
        actions: [
          'Set up automated merge conflict detection',
          'Implement pre-merge validation hooks',
          'Create conflict resolution guidelines'
        ]
      });
    }
    
    if (analysisResults.findings.some(f => f.id === 'inconsistent-commit-messages')) {
      optimizations.push({
        type: 'commit-standardization',
        description: 'Standardize commit message format',
        actions: [
          'Install commitizen for interactive commit messages',
          'Set up commit message validation hooks',
          'Create commit message templates'
        ]
      });
    }
    
    return optimizations;
  }

  async generateConfigurations(analysisResults) {
    const configurations = [];
    
    // Generate Git configuration recommendations
    configurations.push({
      file: '.gitconfig',
      type: 'git-config',
      content: this.generateGitConfig(analysisResults)
    });
    
    configurations.push({
      file: '.github/pull_request_template.md',
      type: 'pr-template',
      content: this.generatePRTemplate(analysisResults)
    });
    
    return configurations;
  }

  generateGitConfig(analysisResults) {
    return `# Recommended Git configuration for workflow optimization
[core]
    autocrlf = input
    editor = code --wait

[merge]
    tool = vscode
    conflictstyle = diff3

[pull]
    rebase = true

[push]
    default = simple
    followTags = true

[branch]
    autosetupmerge = always
    autosetuprebase = always`;
  }

  generatePRTemplate(analysisResults) {
    return `## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
- [ ] No merge conflicts`;
  }

  async generateDocumentation(analysisResults) {
    const documentation = [];
    
    documentation.push({
      file: 'WORKFLOW.md',
      type: 'workflow-guide',
      content: this.generateWorkflowGuide(analysisResults)
    });
    
    return documentation;
  }

  generateWorkflowGuide(analysisResults) {
    return `# Git Workflow Guide

## Current Workflow Analysis
- **Workflow Type**: ${analysisResults.workflow?.type || 'Custom'}
- **Team Size**: ${analysisResults.teamPatterns?.collaborationLevel || 'Unknown'}
- **Branch Count**: ${analysisResults.branches?.total || 0}

## Recommended Practices

### Branch Naming
- Feature branches: \`feature/description\`
- Bug fixes: \`fix/description\`
- Hotfixes: \`hotfix/description\`

### Commit Messages
Use conventional commit format:
\`\`\`
type(scope): description

body (optional)

footer (optional)
\`\`\`

### Pull Request Process
1. Create feature branch from main
2. Make changes and commit
3. Push branch and create PR
4. Request review
5. Merge after approval

## Conflict Resolution
${analysisResults.conflicts?.recommendations?.join('\n- ') || 'No specific recommendations'}`;
  }

  async validateOptimizations(executionResults) {
    const validations = [];
    
    executionResults.optimizations?.forEach(optimization => {
      validations.push({
        optimization: optimization.type,
        status: 'pending',
        description: `Validation needed for ${optimization.description}`
      });
    });
    
    return validations;
  }

  async validateIntegrations(executionResults) {
    const integrations = [];
    
    executionResults.configurations?.forEach(config => {
      integrations.push({
        file: config.file,
        type: config.type,
        status: 'ready',
        description: `Configuration ready for ${config.file}`
      });
    });
    
    return integrations;
  }

  formatFinalOutput(results, options) {
    const metrics = results.sessionState?.metrics || {};
    const findings = results.sessionState?.findings || [];
    
    return `
🔄 **Git Workflow Analysis Complete**

**Repository**: ${results.phases.discovery?.repository?.currentBranch || 'unknown'} branch
**Workflow**: ${results.phases.discovery?.workflow?.type || 'Custom'} (${results.phases.discovery?.workflow?.confidence || 'low'} confidence)
**Team Size**: ${results.phases.discovery?.teamPatterns?.collaborationLevel || 'unknown'}

**Key Metrics**:
- Branches: ${metrics.totalBranches || 0}
- Recent Commits: ${metrics.totalCommits || 0}
- Authors: ${metrics.totalAuthors || 0}
- Conventional Commits: ${metrics.conventionalCommitPercentage || 0}%

**Analysis Results**:
- Findings: ${findings.length} items identified
- Extended Analysis: ${results.extendedAnalysis ? 'Performed' : 'Not required'}
- Optimizations: ${results.phases.execution?.optimizations?.length || 0} generated

**Session Saved**: Analysis saved to \`${this.sessionDir}/\` directory

**Generated Files**:
- \`${this.sessionDir}/report.md\` - Comprehensive analysis report
- \`${this.sessionDir}/state.json\` - Session state for resuming

**Next Steps**:
- Review detailed report for specific recommendations
- Implement suggested workflow optimizations
- Run \`/git-workflow optimize\` to apply improvements

${options.focus !== 'complete' ? `**Focus Area**: ${options.focus}` : ''}
${results.extendedAnalysis ? `\n**Complexity Level**: ${results.extendedAnalysis.complexityAssessment.level}` : ''}
`;
  }

  async startNewAnalysis(options) {
    const analysis = await this.analyzeGitWorkflow();
    const sessionState = this.createInitialSessionState(analysis, options);
    
    await this.saveSession(sessionState);
    await this.generateAnalysisReport(analysis);

    return this.formatAnalysisOutput(analysis, options);
  }

  async analyzeGitWorkflow() {
    const analysis = {
      repository: await this.analyzeRepository(),
      branches: await this.analyzeBranches(),
      commits: await this.analyzeCommits(),
      mergePatterns: await this.analyzeMergePatterns(),
      conflicts: await this.analyzeConflicts(),
      workflow: await this.detectWorkflowType(),
      teamPatterns: await this.analyzeTeamPatterns()
    };

    return analysis;
  }

  async analyzeRepository() {
    try {
      const gitConfig = execSync('git config --list', { encoding: 'utf8' });
      const remotes = execSync('git remote -v', { encoding: 'utf8' });
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      return {
        hasGit: true,
        remotes: this.parseRemotes(remotes),
        config: this.parseGitConfig(gitConfig),
        workingTreeClean: status.trim() === '',
        currentBranch: execSync('git branch --show-current', { encoding: 'utf8' }).trim()
      };
    } catch (error) {
      return {
        hasGit: false,
        error: 'Not a Git repository or Git not available'
      };
    }
  }

  async analyzeBranches() {
    try {
      const branches = execSync('git branch -a', { encoding: 'utf8' });
      const branchList = branches.split('\n')
        .filter(branch => branch.trim())
        .map(branch => branch.replace(/^\*?\s*/, '').trim());

      const branchPatterns = this.detectBranchPatterns(branchList);
      const protectedBranches = await this.detectProtectedBranches(branchList);

      return {
        total: branchList.length,
        branches: branchList,
        patterns: branchPatterns,
        protected: protectedBranches,
        naming: this.analyzeBranchNaming(branchList)
      };
    } catch (error) {
      return { error: 'Failed to analyze branches' };
    }
  }

  async analyzeCommits() {
    try {
      const commitLog = execSync('git log --oneline -100', { encoding: 'utf8' });
      const commits = commitLog.split('\n').filter(line => line.trim());
      
      const commitAnalysis = {
        total: commits.length,
        messagePatterns: this.analyzeCommitMessages(commits),
        frequency: await this.analyzeCommitFrequency(),
        authors: await this.analyzeCommitAuthors()
      };

      return commitAnalysis;
    } catch (error) {
      return { error: 'Failed to analyze commits' };
    }
  }

  async analyzeMergePatterns() {
    try {
      const mergeCommits = execSync('git log --merges --oneline -50', { encoding: 'utf8' });
      const merges = mergeCommits.split('\n').filter(line => line.trim());
      
      return {
        total: merges.length,
        patterns: this.detectMergePatterns(merges),
        strategy: this.detectMergeStrategy()
      };
    } catch (error) {
      return { error: 'Failed to analyze merge patterns' };
    }
  }

  async analyzeConflicts() {
    // Analyze recent merge conflicts from git log
    try {
      const conflictIndicators = execSync('git log --grep="conflict" --grep="merge" --oneline -20', { encoding: 'utf8' });
      const conflicts = conflictIndicators.split('\n').filter(line => line.trim());
      
      return {
        recentConflicts: conflicts.length,
        patterns: this.analyzeConflictPatterns(conflicts),
        recommendations: this.generateConflictRecommendations(conflicts)
      };
    } catch (error) {
      return { error: 'Failed to analyze conflicts' };
    }
  }

  async detectWorkflowType() {
    const branches = await this.analyzeBranches();
    const branchNames = branches.branches || [];
    
    // Detect workflow patterns
    const hasMain = branchNames.some(b => b.includes('main'));
    const hasMaster = branchNames.some(b => b.includes('master'));
    const hasDevelop = branchNames.some(b => b.includes('develop'));
    const hasRelease = branchNames.some(b => b.includes('release'));
    const hasHotfix = branchNames.some(b => b.includes('hotfix'));
    const hasFeature = branchNames.some(b => b.includes('feature'));

    if (hasDevelop && hasRelease && hasHotfix) {
      return { type: 'GitFlow', confidence: 'high' };
    } else if ((hasMain || hasMaster) && hasFeature) {
      return { type: 'GitHub Flow', confidence: 'medium' };
    } else if (branchNames.some(b => b.includes('staging') || b.includes('production'))) {
      return { type: 'GitLab Flow', confidence: 'medium' };
    } else {
      return { type: 'Custom', confidence: 'low' };
    }
  }

  async analyzeTeamPatterns() {
    try {
      const authors = execSync('git shortlog -sn', { encoding: 'utf8' });
      const authorList = authors.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const match = line.match(/^\s*(\d+)\s+(.+)$/);
          return match ? { commits: parseInt(match[1]), author: match[2] } : null;
        })
        .filter(Boolean);

      return {
        totalAuthors: authorList.length,
        topContributors: authorList.slice(0, 5),
        collaborationLevel: this.assessCollaborationLevel(authorList)
      };
    } catch (error) {
      return { error: 'Failed to analyze team patterns' };
    }
  }

  // Helper methods for analysis
  parseRemotes(remotes) {
    return remotes.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split('\t');
        return { name: parts[0], url: parts[1] };
      });
  }

  parseGitConfig(config) {
    const configObj = {};
    config.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        configObj[key.trim()] = value.trim();
      }
    });
    return configObj;
  }

  detectBranchPatterns(branches) {
    const patterns = {
      feature: branches.filter(b => b.includes('feature')).length,
      bugfix: branches.filter(b => b.includes('bugfix') || b.includes('fix')).length,
      hotfix: branches.filter(b => b.includes('hotfix')).length,
      release: branches.filter(b => b.includes('release')).length,
      develop: branches.filter(b => b.includes('develop')).length
    };
    return patterns;
  }

  async detectProtectedBranches(branches) {
    // This would typically integrate with GitHub/GitLab API
    // For now, assume main/master/develop are protected
    return branches.filter(b => 
      b.includes('main') || 
      b.includes('master') || 
      b.includes('develop') ||
      b.includes('production')
    );
  }

  analyzeBranchNaming(branches) {
    const conventions = {
      kebabCase: branches.filter(b => /^[a-z0-9-]+$/.test(b)).length,
      camelCase: branches.filter(b => /^[a-z][a-zA-Z0-9]*$/.test(b)).length,
      withSlashes: branches.filter(b => b.includes('/')).length,
      withUnderscores: branches.filter(b => b.includes('_')).length
    };
    
    const total = branches.length;
    const dominant = Object.entries(conventions)
      .reduce((a, b) => conventions[a[0]] > conventions[b[0]] ? a : b);
    
    return {
      conventions,
      dominant: dominant[0],
      consistency: (dominant[1] / total * 100).toFixed(1) + '%'
    };
  }

  analyzeCommitMessages(commits) {
    const patterns = {
      conventional: commits.filter(c => /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:/.test(c)).length,
      withTickets: commits.filter(c => /#\d+/.test(c) || /[A-Z]+-\d+/.test(c)).length,
      capitalized: commits.filter(c => /^[A-Z]/.test(c.split(' ')[1] || '')).length
    };
    
    return {
      ...patterns,
      total: commits.length,
      conventionalPercentage: (patterns.conventional / commits.length * 100).toFixed(1) + '%'
    };
  }

  async analyzeCommitFrequency() {
    try {
      const lastWeek = execSync('git log --since="1 week ago" --oneline', { encoding: 'utf8' });
      const lastMonth = execSync('git log --since="1 month ago" --oneline', { encoding: 'utf8' });
      
      return {
        lastWeek: lastWeek.split('\n').filter(line => line.trim()).length,
        lastMonth: lastMonth.split('\n').filter(line => line.trim()).length
      };
    } catch (error) {
      return { error: 'Failed to analyze commit frequency' };
    }
  }

  async analyzeCommitAuthors() {
    try {
      const authors = execSync('git log --format="%an" -50', { encoding: 'utf8' });
      const authorList = authors.split('\n').filter(line => line.trim());
      const uniqueAuthors = [...new Set(authorList)];
      
      return {
        total: authorList.length,
        unique: uniqueAuthors.length,
        diversity: (uniqueAuthors.length / authorList.length * 100).toFixed(1) + '%'
      };
    } catch (error) {
      return { error: 'Failed to analyze commit authors' };
    }
  }

  detectMergePatterns(merges) {
    return {
      pullRequests: merges.filter(m => m.includes('pull request') || m.includes('PR')).length,
      directMerges: merges.filter(m => !m.includes('pull request') && !m.includes('PR')).length,
      squashMerges: merges.filter(m => m.includes('squash')).length
    };
  }

  detectMergeStrategy() {
    // This would analyze git config and recent merge commits
    return 'merge'; // Default assumption
  }

  analyzeConflictPatterns(conflicts) {
    return {
      fileTypes: this.extractFileTypesFromConflicts(conflicts),
      frequency: conflicts.length > 5 ? 'high' : conflicts.length > 2 ? 'medium' : 'low'
    };
  }

  extractFileTypesFromConflicts(conflicts) {
    // Extract file extensions from conflict messages
    const extensions = [];
    conflicts.forEach(conflict => {
      const matches = conflict.match(/\.\w+/g);
      if (matches) extensions.push(...matches);
    });
    return [...new Set(extensions)];
  }

  generateConflictRecommendations(conflicts) {
    const recommendations = [];
    
    if (conflicts.length > 5) {
      recommendations.push('Consider implementing more frequent integration');
      recommendations.push('Review branching strategy to reduce parallel development');
    }
    
    if (conflicts.some(c => c.includes('package.json') || c.includes('package-lock.json'))) {
      recommendations.push('Implement dependency update coordination');
    }
    
    return recommendations;
  }

  assessCollaborationLevel(authors) {
    if (authors.length === 1) return 'solo';
    if (authors.length <= 3) return 'small-team';
    if (authors.length <= 10) return 'medium-team';
    return 'large-team';
  }

  createInitialSessionState(analysis, options) {
    return {
      sessionId: Date.now().toString(),
      command: 'git-workflow',
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      phase: 'analysis',
      progress: {
        totalSteps: 6,
        completedSteps: 1,
        currentStep: 'Repository Analysis Complete'
      },
      context: {
        projectType: 'git-repository',
        workflowType: analysis.workflow?.type || 'unknown',
        teamSize: analysis.teamPatterns?.collaborationLevel || 'unknown',
        focus: options.focus
      },
      findings: this.generateFindings(analysis),
      metrics: this.extractMetrics(analysis)
    };
  }

  generateFindings(analysis) {
    const findings = [];
    
    // Branch analysis findings
    if (analysis.branches?.patterns?.feature === 0) {
      findings.push({
        id: 'no-feature-branches',
        type: 'recommendation',
        severity: 'medium',
        description: 'No feature branches detected',
        location: 'Branch structure',
        remediation: 'Consider implementing feature branch workflow',
        status: 'pending'
      });
    }
    
    // Commit message findings
    if (analysis.commits?.messagePatterns?.conventionalPercentage < 50) {
      findings.push({
        id: 'inconsistent-commit-messages',
        type: 'issue',
        severity: 'low',
        description: 'Inconsistent commit message format',
        location: 'Commit history',
        remediation: 'Implement conventional commit format',
        status: 'pending'
      });
    }
    
    // Conflict findings
    if (analysis.conflicts?.recentConflicts > 5) {
      findings.push({
        id: 'frequent-conflicts',
        type: 'issue',
        severity: 'high',
        description: 'Frequent merge conflicts detected',
        location: 'Merge history',
        remediation: 'Review branching strategy and integration frequency',
        status: 'pending'
      });
    }
    
    return findings;
  }

  extractMetrics(analysis) {
    return {
      totalBranches: analysis.branches?.total || 0,
      totalCommits: analysis.commits?.total || 0,
      totalAuthors: analysis.teamPatterns?.totalAuthors || 0,
      recentConflicts: analysis.conflicts?.recentConflicts || 0,
      conventionalCommitPercentage: parseFloat(analysis.commits?.messagePatterns?.conventionalPercentage) || 0
    };
  }

  async generateAnalysisReport(analysis) {
    const report = this.formatAnalysisReport(analysis);
    const reportPath = path.join(this.sessionDir, 'analysis.md');
    await fs.writeFile(reportPath, report, 'utf8');
  }

  formatAnalysisReport(analysis) {
    return `# Git Workflow Analysis Report

Generated: ${new Date().toISOString()}

## Repository Overview

- **Current Branch**: ${analysis.repository?.currentBranch || 'unknown'}
- **Working Tree**: ${analysis.repository?.workingTreeClean ? 'Clean' : 'Modified files present'}
- **Workflow Type**: ${analysis.workflow?.type || 'Unknown'} (${analysis.workflow?.confidence || 'low'} confidence)

## Branch Analysis

- **Total Branches**: ${analysis.branches?.total || 0}
- **Feature Branches**: ${analysis.branches?.patterns?.feature || 0}
- **Release Branches**: ${analysis.branches?.patterns?.release || 0}
- **Hotfix Branches**: ${analysis.branches?.patterns?.hotfix || 0}

### Branch Naming Convention
- **Dominant Pattern**: ${analysis.branches?.naming?.dominant || 'unknown'}
- **Consistency**: ${analysis.branches?.naming?.consistency || '0%'}

## Commit Analysis

- **Total Commits (last 100)**: ${analysis.commits?.total || 0}
- **Conventional Commits**: ${analysis.commits?.messagePatterns?.conventionalPercentage || '0%'}
- **Commits with Tickets**: ${analysis.commits?.messagePatterns?.withTickets || 0}

## Team Collaboration

- **Total Authors**: ${analysis.teamPatterns?.totalAuthors || 0}
- **Collaboration Level**: ${analysis.teamPatterns?.collaborationLevel || 'unknown'}
- **Top Contributors**: ${analysis.teamPatterns?.topContributors?.map(c => `${c.author} (${c.commits})`).join(', ') || 'none'}

## Merge Patterns

- **Total Merges (last 50)**: ${analysis.mergePatterns?.total || 0}
- **Pull Request Merges**: ${analysis.mergePatterns?.patterns?.pullRequests || 0}
- **Direct Merges**: ${analysis.mergePatterns?.patterns?.directMerges || 0}

## Conflict Analysis

- **Recent Conflicts**: ${analysis.conflicts?.recentConflicts || 0}
- **Conflict Frequency**: ${analysis.conflicts?.patterns?.frequency || 'low'}

## Recommendations

${this.generateRecommendations(analysis)}
`;
  }

  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.workflow?.type === 'Custom' || analysis.workflow?.confidence === 'low') {
      recommendations.push('- Consider adopting a standardized workflow (GitHub Flow or GitFlow)');
    }
    
    if (analysis.commits?.messagePatterns?.conventionalPercentage < 50) {
      recommendations.push('- Implement conventional commit message format for better changelog generation');
    }
    
    if (analysis.branches?.naming?.consistency < 70) {
      recommendations.push('- Establish consistent branch naming conventions');
    }
    
    if (analysis.conflicts?.recentConflicts > 5) {
      recommendations.push('- Review integration frequency to reduce merge conflicts');
    }
    
    if (analysis.teamPatterns?.collaborationLevel === 'large-team' && analysis.mergePatterns?.patterns?.directMerges > 0) {
      recommendations.push('- Enforce pull request workflow for all changes');
    }
    
    return recommendations.length > 0 ? recommendations.join('\n') : '- Workflow appears to be well-structured';
  }

  formatAnalysisOutput(analysis, options) {
    return `
🔄 **Git Workflow Analysis Complete**

**Repository**: ${analysis.repository?.currentBranch || 'unknown'} branch
**Workflow**: ${analysis.workflow?.type || 'Custom'} (${analysis.workflow?.confidence || 'low'} confidence)
**Team Size**: ${analysis.teamPatterns?.collaborationLevel || 'unknown'}

**Key Metrics**:
- Branches: ${analysis.branches?.total || 0}
- Recent Commits: ${analysis.commits?.total || 0}
- Authors: ${analysis.teamPatterns?.totalAuthors || 0}
- Conventional Commits: ${analysis.commits?.messagePatterns?.conventionalPercentage || '0%'}

**Session Created**: Analysis saved to \`git-workflow/\` directory

**Next Steps**:
- Run \`/git-workflow optimize\` to apply improvements
- Run \`/git-workflow resume\` to continue analysis
- Check \`git-workflow/analysis.md\` for detailed report

${options.focus !== 'complete' ? `**Focus Area**: ${options.focus}` : ''}
`;
  }

  async resumeSession(sessionState) {
    return `
🔄 **Resuming Git Workflow Optimization**

**Session**: ${sessionState.sessionId}
**Progress**: ${sessionState.progress.completedSteps}/${sessionState.progress.totalSteps} steps
**Current**: ${sessionState.progress.currentStep}
**Workflow**: ${sessionState.context.workflowType}

**Findings**: ${sessionState.findings.length} items identified
**Focus**: ${sessionState.context.focus}

Run \`/git-workflow optimize\` to continue improvements.
`;
  }
}

module.exports = GitWorkflowCommand;