/**
 * Command Registration and Discovery System
 * Manages advanced web development commands
 */

class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.categories = new Map();
  }

  /**
   * Register a command
   */
  register(commandName, commandClass, options = {}) {
    if (this.commands.has(commandName)) {
      throw new Error(`Command '${commandName}' is already registered`);
    }

    const commandInfo = {
      name: commandName,
      class: commandClass,
      description: options.description || '',
      category: options.category || 'general',
      version: options.version || '1.0.0',
      dependencies: options.dependencies || [],
      extendedThinking: options.extendedThinking || false,
      sessionSupport: options.sessionSupport !== false, // default true
      aliases: options.aliases || [],
      examples: options.examples || []
    };

    this.commands.set(commandName, commandInfo);

    // Register aliases
    for (const alias of commandInfo.aliases) {
      if (this.commands.has(alias)) {
        throw new Error(`Alias '${alias}' conflicts with existing command`);
      }
      this.commands.set(alias, commandInfo);
    }

    // Update category
    if (!this.categories.has(commandInfo.category)) {
      this.categories.set(commandInfo.category, []);
    }
    this.categories.get(commandInfo.category).push(commandName);

    console.log(`✓ Registered command: ${commandName}`);
    return commandInfo;
  }

  /**
   * Get command info
   */
  get(commandName) {
    return this.commands.get(commandName);
  }

  /**
   * Check if command exists
   */
  has(commandName) {
    return this.commands.has(commandName);
  }

  /**
   * Create command instance
   */
  create(commandName, ...args) {
    const commandInfo = this.get(commandName);
    if (!commandInfo) {
      throw new Error(`Command '${commandName}' not found`);
    }

    return new commandInfo.class(commandName, ...args);
  }

  /**
   * List all commands
   */
  list() {
    const commands = [];
    const processed = new Set();

    for (const [name, info] of this.commands) {
      if (!processed.has(info.name)) {
        commands.push({
          name: info.name,
          description: info.description,
          category: info.category,
          aliases: info.aliases,
          extendedThinking: info.extendedThinking
        });
        processed.add(info.name);
      }
    }

    return commands.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * List commands by category
   */
  listByCategory() {
    const result = {};
    for (const [category, commandNames] of this.categories) {
      result[category] = commandNames.map(name => {
        const info = this.get(name);
        return {
          name: info.name,
          description: info.description,
          extendedThinking: info.extendedThinking
        };
      });
    }
    return result;
  }

  /**
   * Search commands
   */
  search(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const [name, info] of this.commands) {
      if (name === info.name) { // Skip aliases in search
        const matches = 
          info.name.toLowerCase().includes(lowerQuery) ||
          info.description.toLowerCase().includes(lowerQuery) ||
          info.category.toLowerCase().includes(lowerQuery);

        if (matches) {
          results.push({
            name: info.name,
            description: info.description,
            category: info.category,
            relevance: this.calculateRelevance(info, lowerQuery)
          });
        }
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Get command suggestions based on context
   */
  getSuggestions(context = {}) {
    const suggestions = [];

    // Suggest based on project type
    if (context.projectType) {
      const relevantCommands = this.getCommandsForProjectType(context.projectType);
      suggestions.push(...relevantCommands);
    }

    // Suggest based on current phase
    if (context.phase) {
      const phaseCommands = this.getCommandsForPhase(context.phase);
      suggestions.push(...phaseCommands);
    }

    // Remove duplicates and sort by relevance
    const unique = [...new Set(suggestions)];
    return unique.slice(0, 5); // Top 5 suggestions
  }

  /**
   * Validate command dependencies
   */
  validateDependencies(commandName) {
    const commandInfo = this.get(commandName);
    if (!commandInfo) {
      throw new Error(`Command '${commandName}' not found`);
    }

    const missing = [];
    for (const dep of commandInfo.dependencies) {
      if (!this.has(dep)) {
        missing.push(dep);
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Get command help
   */
  getHelp(commandName) {
    const commandInfo = this.get(commandName);
    if (!commandInfo) {
      return null;
    }

    return {
      name: commandInfo.name,
      description: commandInfo.description,
      category: commandInfo.category,
      version: commandInfo.version,
      aliases: commandInfo.aliases,
      examples: commandInfo.examples,
      sessionSupport: commandInfo.sessionSupport,
      extendedThinking: commandInfo.extendedThinking,
      dependencies: commandInfo.dependencies
    };
  }

  // Private helper methods
  calculateRelevance(commandInfo, query) {
    let score = 0;
    
    // Exact name match gets highest score
    if (commandInfo.name.toLowerCase() === query) {
      score += 100;
    } else if (commandInfo.name.toLowerCase().includes(query)) {
      score += 50;
    }
    
    // Description match
    if (commandInfo.description.toLowerCase().includes(query)) {
      score += 25;
    }
    
    // Category match
    if (commandInfo.category.toLowerCase().includes(query)) {
      score += 10;
    }
    
    return score;
  }

  getCommandsForProjectType(projectType) {
    const typeMap = {
      'react': ['performance-audit', 'accessibility-scan', 'visual-regression'],
      'vue': ['performance-audit', 'accessibility-scan', 'visual-regression'],
      'angular': ['performance-audit', 'accessibility-scan', 'visual-regression'],
      'node': ['database-optimize', 'api-docs', 'monitoring-setup'],
      'express': ['api-docs', 'monitoring-setup', 'database-optimize'],
      'docker': ['docker-optimize', 'monitoring-setup'],
      'kubernetes': ['docker-optimize', 'monitoring-setup']
    };

    return typeMap[projectType.toLowerCase()] || [];
  }

  getCommandsForPhase(phase) {
    const phaseMap = {
      'analysis': ['architecture-analysis', 'performance-audit', 'accessibility-scan'],
      'development': ['api-docs', 'visual-regression', 'i18n-extract'],
      'testing': ['visual-regression', 'performance-audit'],
      'deployment': ['docker-optimize', 'monitoring-setup'],
      'maintenance': ['architecture-analysis', 'database-optimize']
    };

    return phaseMap[phase.toLowerCase()] || [];
  }
}

// Global registry instance
const registry = new CommandRegistry();

module.exports = {
  CommandRegistry,
  registry
};