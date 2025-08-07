/**
 * Session Management Utilities for Advanced Web Development Commands
 * Provides common session state interface and persistence following CCPlugins patterns
 */

const fs = require('fs').promises;
const path = require('path');

class SessionManager {
  constructor(commandName) {
    this.commandName = commandName;
    this.sessionDir = path.join(process.cwd(), commandName);
    this.stateFile = path.join(this.sessionDir, 'state.json');
    this.planFile = path.join(this.sessionDir, 'plan.md');
  }

  /**
   * Initialize session directory and files
   */
  async initialize() {
    try {
      await fs.mkdir(this.sessionDir, { recursive: true });
      
      // Create initial state if it doesn't exist
      if (!await this.exists(this.stateFile)) {
        await this.saveState(this.getInitialState());
      }
      
      return true;
    } catch (error) {
      throw new Error(`Failed to initialize session: ${error.message}`);
    }
  }

  /**
   * Get initial state structure
   */
  getInitialState() {
    return {
      sessionId: this.generateSessionId(),
      command: this.commandName,
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      phase: 'analysis',
      progress: {
        totalSteps: 0,
        completedSteps: 0,
        currentStep: 'initializing'
      },
      context: {
        projectType: null,
        frameworks: [],
        technologies: [],
        customConfig: {}
      },
      findings: [],
      metrics: {}
    };
  }

  /**
   * Check if session exists
   */
  async sessionExists() {
    try {
      return await this.exists(this.stateFile);
    } catch {
      return false;
    }
  }

  /**
   * Load session state
   */
  async loadState() {
    try {
      if (!await this.sessionExists()) {
        return this.getInitialState();
      }
      
      const stateData = await fs.readFile(this.stateFile, 'utf8');
      const state = JSON.parse(stateData);
      
      // Validate state structure
      return this.validateState(state);
    } catch (error) {
      console.warn(`Failed to load session state: ${error.message}`);
      return this.getInitialState();
    }
  }

  /**
   * Save session state
   */
  async saveState(state) {
    try {
      await fs.mkdir(this.sessionDir, { recursive: true });
      
      // Update timestamp
      state.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(this.stateFile, JSON.stringify(state, null, 2));
      return true;
    } catch (error) {
      throw new Error(`Failed to save session state: ${error.message}`);
    }
  }

  /**
   * Load plan markdown file
   */
  async loadPlan() {
    try {
      if (!await this.exists(this.planFile)) {
        return null;
      }
      
      return await fs.readFile(this.planFile, 'utf8');
    } catch (error) {
      console.warn(`Failed to load plan: ${error.message}`);
      return null;
    }
  }

  /**
   * Save plan markdown file
   */
  async savePlan(planContent) {
    try {
      await fs.mkdir(this.sessionDir, { recursive: true });
      await fs.writeFile(this.planFile, planContent);
      return true;
    } catch (error) {
      throw new Error(`Failed to save plan: ${error.message}`);
    }
  }

  /**
   * Update progress
   */
  async updateProgress(currentStep, completedSteps = null, totalSteps = null) {
    const state = await this.loadState();
    
    state.progress.currentStep = currentStep;
    if (completedSteps !== null) state.progress.completedSteps = completedSteps;
    if (totalSteps !== null) state.progress.totalSteps = totalSteps;
    
    await this.saveState(state);
    return state;
  }

  /**
   * Add finding to session
   */
  async addFinding(finding) {
    const state = await this.loadState();
    
    const newFinding = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...finding
    };
    
    state.findings.push(newFinding);
    await this.saveState(state);
    
    return newFinding;
  }

  /**
   * Update finding status
   */
  async updateFinding(findingId, updates) {
    const state = await this.loadState();
    
    const findingIndex = state.findings.findIndex(f => f.id === findingId);
    if (findingIndex === -1) {
      throw new Error(`Finding with ID ${findingId} not found`);
    }
    
    state.findings[findingIndex] = {
      ...state.findings[findingIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    await this.saveState(state);
    return state.findings[findingIndex];
  }

  /**
   * Set metrics
   */
  async setMetrics(metrics) {
    const state = await this.loadState();
    state.metrics = { ...state.metrics, ...metrics };
    await this.saveState(state);
    return state.metrics;
  }

  /**
   * Validate state structure
   */
  validateState(state) {
    const requiredFields = ['sessionId', 'command', 'startTime', 'phase', 'progress', 'context', 'findings'];
    
    for (const field of requiredFields) {
      if (!state.hasOwnProperty(field)) {
        console.warn(`Missing required field: ${field}, using default`);
        const defaultState = this.getInitialState();
        state[field] = defaultState[field];
      }
    }
    
    // Ensure progress has required structure
    if (!state.progress.hasOwnProperty('totalSteps')) {
      state.progress.totalSteps = 0;
    }
    if (!state.progress.hasOwnProperty('completedSteps')) {
      state.progress.completedSteps = 0;
    }
    if (!state.progress.hasOwnProperty('currentStep')) {
      state.progress.currentStep = 'unknown';
    }
    
    return state;
  }

  /**
   * Recovery mechanism for corrupted sessions
   */
  async recoverSession() {
    try {
      // Try to backup corrupted state
      if (await this.exists(this.stateFile)) {
        const backupFile = `${this.stateFile}.backup.${Date.now()}`;
        await fs.copyFile(this.stateFile, backupFile);
        console.log(`Backed up corrupted state to: ${backupFile}`);
      }
      
      // Create fresh state
      const freshState = this.getInitialState();
      await this.saveState(freshState);
      
      console.log('Session recovered with fresh state');
      return freshState;
    } catch (error) {
      throw new Error(`Failed to recover session: ${error.message}`);
    }
  }

  /**
   * Clean up session files
   */
  async cleanup() {
    try {
      if (await this.exists(this.sessionDir)) {
        await fs.rmdir(this.sessionDir, { recursive: true });
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`Failed to cleanup session: ${error.message}`);
      return false;
    }
  }

  /**
   * Get session summary
   */
  async getSummary() {
    const state = await this.loadState();
    const plan = await this.loadPlan();
    
    return {
      command: state.command,
      phase: state.phase,
      progress: state.progress,
      findingsCount: state.findings.length,
      criticalFindings: state.findings.filter(f => f.severity === 'critical').length,
      hasPlan: !!plan,
      lastUpdated: state.lastUpdated,
      sessionAge: this.getSessionAge(state.startTime)
    };
  }

  // Utility methods
  generateSessionId() {
    return `${this.commandName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getSessionAge(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  }
}

module.exports = SessionManager;