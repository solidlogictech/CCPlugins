/**
 * Shared Analysis Utilities for Advanced Web Development Commands
 * Provides project type detection, framework recognition, and technology stack analysis
 */

const fs = require('fs').promises;
const path = require('path');

class AnalysisUtilities {
  constructor() {
    this.projectTypeCache = new Map();
    this.frameworkPatterns = this.initializeFrameworkPatterns();
    this.technologyPatterns = this.initializeTechnologyPatterns();
  }

  /**
   * Detect project type based on files and dependencies
   */
  async detectProjectType(projectPath = process.cwd()) {
    if (this.projectTypeCache.has(projectPath)) {
      return this.projectTypeCache.get(projectPath);
    }

    const analysis = {
      primaryType: 'unknown',
      secondaryTypes: [],
      confidence: 0,
      evidence: []
    };

    try {
      // Check package.json for Node.js projects
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await this.fileExists(packageJsonPath)) {
        const packageData = await this.readJsonFile(packageJsonPath);
        const nodeAnalysis = await this.analyzeNodeProject(packageData);
        
        if (nodeAnalysis.confidence > analysis.confidence) {
          analysis.primaryType = nodeAnalysis.type;
          analysis.confidence = nodeAnalysis.confidence;
          analysis.evidence.push(...nodeAnalysis.evidence);
        }
      }

      // Check for other project types
      const otherTypes = await this.detectOtherProjectTypes(projectPath);
      analysis.secondaryTypes.push(...otherTypes);

      // Cache result
      this.projectTypeCache.set(projectPath, analysis);
      
      return analysis;
    } catch (error) {
      console.warn(`Error detecting project type: ${error.message}`);
      return analysis;
    }
  }

  /**
   * Detect frameworks used in the project
   */
  async detectFrameworks(projectPath = process.cwd()) {
    const frameworks = [];

    try {
      // Check package.json dependencies
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await this.fileExists(packageJsonPath)) {
        const packageData = await this.readJsonFile(packageJsonPath);
        const deps = {
          ...packageData.dependencies,
          ...packageData.devDependencies,
          ...packageData.peerDependencies
        };

        for (const [framework, patterns] of this.frameworkPatterns) {
          const detection = this.detectFrameworkFromDependencies(framework, patterns, deps);
          if (detection.detected) {
            frameworks.push(detection);
          }
        }
      }

      // Check for framework-specific files
      const fileBasedDetection = await this.detectFrameworksFromFiles(projectPath);
      frameworks.push(...fileBasedDetection);

      // Remove duplicates and sort by confidence
      const uniqueFrameworks = this.deduplicateFrameworks(frameworks);
      return uniqueFrameworks.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.warn(`Error detecting frameworks: ${error.message}`);
      return [];
    }
  }

  /**
   * Analyze technology stack
   */
  async analyzeTechnologyStack(projectPath = process.cwd()) {
    const stack = {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      cloudServices: [],
      buildTools: []
    };

    try {
      // Detect languages from file extensions
      stack.languages = await this.detectLanguages(projectPath);
      
      // Detect frameworks
      stack.frameworks = await this.detectFrameworks(projectPath);
      
      // Detect databases and tools from package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await this.fileExists(packageJsonPath)) {
        const packageData = await this.readJsonFile(packageJsonPath);
        const deps = {
          ...packageData.dependencies,
          ...packageData.devDependencies
        };

        stack.databases = this.detectDatabases(deps);
        stack.tools = this.detectTools(deps);
        stack.buildTools = this.detectBuildTools(deps);
      }

      // Detect cloud services from config files
      stack.cloudServices = await this.detectCloudServices(projectPath);

      return stack;
    } catch (error) {
      console.warn(`Error analyzing technology stack: ${error.message}`);
      return stack;
    }
  }

  /**
   * Analyze dependencies and versions
   */
  async analyzeDependencies(projectPath = process.cwd()) {
    const analysis = {
      total: 0,
      production: 0,
      development: 0,
      outdated: [],
      vulnerable: [],
      unused: [],
      duplicates: []
    };

    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (!await this.fileExists(packageJsonPath)) {
        return analysis;
      }

      const packageData = await this.readJsonFile(packageJsonPath);
      
      // Count dependencies
      analysis.production = Object.keys(packageData.dependencies || {}).length;
      analysis.development = Object.keys(packageData.devDependencies || {}).length;
      analysis.total = analysis.production + analysis.development;

      // Analyze dependency health (simplified - would need npm audit in real implementation)
      const allDeps = {
        ...packageData.dependencies,
        ...packageData.devDependencies
      };

      // Check for common outdated patterns
      analysis.outdated = this.findOutdatedDependencies(allDeps);
      
      // Check for potential security issues
      analysis.vulnerable = this.findVulnerableDependencies(allDeps);

      return analysis;
    } catch (error) {
      console.warn(`Error analyzing dependencies: ${error.message}`);
      return analysis;
    }
  }

  /**
   * Get project structure overview
   */
  async getProjectStructure(projectPath = process.cwd(), maxDepth = 3) {
    const structure = {
      root: projectPath,
      directories: [],
      files: [],
      totalFiles: 0,
      totalDirectories: 0
    };

    try {
      await this.buildStructureRecursive(projectPath, structure, 0, maxDepth);
      return structure;
    } catch (error) {
      console.warn(`Error getting project structure: ${error.message}`);
      return structure;
    }
  }

  // Private helper methods

  initializeFrameworkPatterns() {
    return new Map([
      ['React', {
        dependencies: ['react', 'react-dom', '@types/react'],
        files: ['src/App.jsx', 'src/App.tsx', 'public/index.html'],
        patterns: ['jsx', 'tsx']
      }],
      ['Vue', {
        dependencies: ['vue', '@vue/cli', 'vue-loader'],
        files: ['src/App.vue', 'vue.config.js'],
        patterns: ['vue']
      }],
      ['Angular', {
        dependencies: ['@angular/core', '@angular/cli', 'typescript'],
        files: ['angular.json', 'src/app/app.component.ts'],
        patterns: ['component.ts', 'module.ts']
      }],
      ['Express', {
        dependencies: ['express', 'express-generator'],
        files: ['app.js', 'server.js', 'routes/'],
        patterns: ['middleware', 'routes']
      }],
      ['Next.js', {
        dependencies: ['next', 'react', 'react-dom'],
        files: ['next.config.js', 'pages/', 'app/'],
        patterns: ['pages/', 'app/']
      }],
      ['Nuxt.js', {
        dependencies: ['nuxt', 'vue'],
        files: ['nuxt.config.js', 'pages/', 'layouts/'],
        patterns: ['nuxt.config']
      }],
      ['Svelte', {
        dependencies: ['svelte', '@sveltejs/kit'],
        files: ['svelte.config.js', 'src/App.svelte'],
        patterns: ['svelte']
      }],
      ['FastAPI', {
        dependencies: ['fastapi', 'uvicorn'],
        files: ['main.py', 'app.py'],
        patterns: ['FastAPI', 'uvicorn']
      }],
      ['Django', {
        dependencies: ['django'],
        files: ['manage.py', 'settings.py', 'urls.py'],
        patterns: ['django']
      }],
      ['Flask', {
        dependencies: ['flask'],
        files: ['app.py', 'wsgi.py'],
        patterns: ['flask']
      }]
    ]);
  }

  initializeTechnologyPatterns() {
    return {
      databases: [
        'mongodb', 'mongoose', 'mysql', 'mysql2', 'postgresql', 'pg',
        'sqlite3', 'redis', 'ioredis', 'cassandra-driver', 'neo4j-driver'
      ],
      tools: [
        'webpack', 'vite', 'rollup', 'parcel', 'gulp', 'grunt',
        'babel', 'typescript', 'eslint', 'prettier', 'jest', 'mocha',
        'cypress', 'playwright', 'puppeteer', 'storybook'
      ],
      cloudServices: [
        'aws-sdk', '@aws-sdk', 'azure', '@azure', 'google-cloud',
        'firebase', 'vercel', 'netlify', 'heroku'
      ]
    };
  }

  async analyzeNodeProject(packageData) {
    const analysis = {
      type: 'node',
      confidence: 0.5,
      evidence: ['package.json found']
    };

    // Check for specific project types
    if (packageData.dependencies?.react || packageData.devDependencies?.react) {
      analysis.type = 'react';
      analysis.confidence = 0.9;
      analysis.evidence.push('React dependency found');
    } else if (packageData.dependencies?.vue || packageData.devDependencies?.vue) {
      analysis.type = 'vue';
      analysis.confidence = 0.9;
      analysis.evidence.push('Vue dependency found');
    } else if (packageData.dependencies?.['@angular/core']) {
      analysis.type = 'angular';
      analysis.confidence = 0.9;
      analysis.evidence.push('Angular dependency found');
    } else if (packageData.dependencies?.express) {
      analysis.type = 'express';
      analysis.confidence = 0.8;
      analysis.evidence.push('Express dependency found');
    } else if (packageData.dependencies?.next) {
      analysis.type = 'nextjs';
      analysis.confidence = 0.9;
      analysis.evidence.push('Next.js dependency found');
    }

    return analysis;
  }

  async detectOtherProjectTypes(projectPath) {
    const types = [];

    // Check for Python projects
    if (await this.fileExists(path.join(projectPath, 'requirements.txt')) ||
        await this.fileExists(path.join(projectPath, 'setup.py')) ||
        await this.fileExists(path.join(projectPath, 'pyproject.toml'))) {
      types.push('python');
    }

    // Check for Java projects
    if (await this.fileExists(path.join(projectPath, 'pom.xml')) ||
        await this.fileExists(path.join(projectPath, 'build.gradle'))) {
      types.push('java');
    }

    // Check for .NET projects
    if (await this.fileExists(path.join(projectPath, '*.csproj')) ||
        await this.fileExists(path.join(projectPath, '*.sln'))) {
      types.push('dotnet');
    }

    // Check for Go projects
    if (await this.fileExists(path.join(projectPath, 'go.mod'))) {
      types.push('go');
    }

    // Check for Rust projects
    if (await this.fileExists(path.join(projectPath, 'Cargo.toml'))) {
      types.push('rust');
    }

    return types;
  }

  detectFrameworkFromDependencies(framework, patterns, dependencies) {
    let confidence = 0;
    const evidence = [];

    for (const dep of patterns.dependencies) {
      if (dependencies[dep]) {
        confidence += 0.3;
        evidence.push(`${dep} dependency found`);
      }
    }

    return {
      name: framework,
      detected: confidence > 0,
      confidence: Math.min(confidence, 1.0),
      evidence,
      version: this.extractVersion(dependencies, patterns.dependencies[0])
    };
  }

  async detectFrameworksFromFiles(projectPath) {
    const frameworks = [];

    for (const [framework, patterns] of this.frameworkPatterns) {
      let confidence = 0;
      const evidence = [];

      for (const file of patterns.files) {
        if (await this.fileExists(path.join(projectPath, file))) {
          confidence += 0.2;
          evidence.push(`${file} found`);
        }
      }

      if (confidence > 0) {
        frameworks.push({
          name: framework,
          detected: true,
          confidence: Math.min(confidence, 1.0),
          evidence
        });
      }
    }

    return frameworks;
  }

  async detectLanguages(projectPath) {
    const languages = new Map();
    const extensions = {
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.py': 'Python',
      '.java': 'Java',
      '.cs': 'C#',
      '.go': 'Go',
      '.rs': 'Rust',
      '.php': 'PHP',
      '.rb': 'Ruby',
      '.cpp': 'C++',
      '.c': 'C',
      '.swift': 'Swift',
      '.kt': 'Kotlin'
    };

    try {
      await this.countFilesByExtension(projectPath, extensions, languages, 0, 2);
      
      return Array.from(languages.entries())
        .map(([lang, count]) => ({ name: lang, fileCount: count }))
        .sort((a, b) => b.fileCount - a.fileCount);
    } catch (error) {
      return [];
    }
  }

  detectDatabases(dependencies) {
    const databases = [];
    const dbPatterns = this.technologyPatterns.databases;

    for (const dep of Object.keys(dependencies)) {
      for (const pattern of dbPatterns) {
        if (dep.includes(pattern)) {
          databases.push({
            name: this.getDatabaseName(pattern),
            package: dep,
            version: dependencies[dep]
          });
        }
      }
    }

    return databases;
  }

  detectTools(dependencies) {
    const tools = [];
    const toolPatterns = this.technologyPatterns.tools;

    for (const dep of Object.keys(dependencies)) {
      for (const pattern of toolPatterns) {
        if (dep.includes(pattern)) {
          tools.push({
            name: pattern,
            package: dep,
            version: dependencies[dep],
            category: this.getToolCategory(pattern)
          });
        }
      }
    }

    return tools;
  }

  detectBuildTools(dependencies) {
    const buildTools = ['webpack', 'vite', 'rollup', 'parcel', 'gulp', 'grunt'];
    const detected = [];

    for (const dep of Object.keys(dependencies)) {
      for (const tool of buildTools) {
        if (dep.includes(tool)) {
          detected.push({
            name: tool,
            package: dep,
            version: dependencies[dep]
          });
        }
      }
    }

    return detected;
  }

  async detectCloudServices(projectPath) {
    const services = [];

    // Check for cloud service config files
    const configFiles = [
      { file: 'vercel.json', service: 'Vercel' },
      { file: 'netlify.toml', service: 'Netlify' },
      { file: 'firebase.json', service: 'Firebase' },
      { file: 'aws-exports.js', service: 'AWS Amplify' },
      { file: 'azure-pipelines.yml', service: 'Azure' },
      { file: '.github/workflows', service: 'GitHub Actions' },
      { file: 'Dockerfile', service: 'Docker' },
      { file: 'docker-compose.yml', service: 'Docker Compose' },
      { file: 'k8s/', service: 'Kubernetes' },
      { file: 'terraform/', service: 'Terraform' }
    ];

    for (const { file, service } of configFiles) {
      if (await this.fileExists(path.join(projectPath, file))) {
        services.push(service);
      }
    }

    return services;
  }

  // Utility methods
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readJsonFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
    }
  }

  async buildStructureRecursive(dirPath, structure, currentDepth, maxDepth) {
    if (currentDepth >= maxDepth) return;

    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        // Skip hidden files and common ignore patterns
        if (item.name.startsWith('.') || 
            ['node_modules', 'dist', 'build', '__pycache__'].includes(item.name)) {
          continue;
        }

        const fullPath = path.join(dirPath, item.name);
        const relativePath = path.relative(structure.root, fullPath);

        if (item.isDirectory()) {
          structure.directories.push(relativePath);
          structure.totalDirectories++;
          await this.buildStructureRecursive(fullPath, structure, currentDepth + 1, maxDepth);
        } else {
          structure.files.push(relativePath);
          structure.totalFiles++;
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  async countFilesByExtension(dirPath, extensions, languages, currentDepth, maxDepth) {
    if (currentDepth >= maxDepth) return;

    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        if (item.name.startsWith('.') || 
            ['node_modules', 'dist', 'build'].includes(item.name)) {
          continue;
        }

        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          await this.countFilesByExtension(fullPath, extensions, languages, currentDepth + 1, maxDepth);
        } else {
          const ext = path.extname(item.name);
          if (extensions[ext]) {
            const lang = extensions[ext];
            languages.set(lang, (languages.get(lang) || 0) + 1);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  deduplicateFrameworks(frameworks) {
    const seen = new Set();
    return frameworks.filter(fw => {
      if (seen.has(fw.name)) return false;
      seen.add(fw.name);
      return true;
    });
  }

  extractVersion(dependencies, packageName) {
    return dependencies[packageName] || 'unknown';
  }

  getDatabaseName(pattern) {
    const nameMap = {
      'mongodb': 'MongoDB',
      'mongoose': 'MongoDB',
      'mysql': 'MySQL',
      'mysql2': 'MySQL',
      'postgresql': 'PostgreSQL',
      'pg': 'PostgreSQL',
      'sqlite3': 'SQLite',
      'redis': 'Redis',
      'ioredis': 'Redis'
    };
    return nameMap[pattern] || pattern;
  }

  getToolCategory(tool) {
    const categories = {
      'webpack': 'bundler',
      'vite': 'bundler',
      'rollup': 'bundler',
      'babel': 'transpiler',
      'typescript': 'transpiler',
      'eslint': 'linter',
      'prettier': 'formatter',
      'jest': 'testing',
      'mocha': 'testing',
      'cypress': 'testing',
      'storybook': 'documentation'
    };
    return categories[tool] || 'tool';
  }

  findOutdatedDependencies(dependencies) {
    // Simplified - in real implementation would check against npm registry
    const commonOutdated = [];
    for (const [dep, version] of Object.entries(dependencies)) {
      if (version.includes('^0.') || version.includes('~0.')) {
        commonOutdated.push({ name: dep, version, reason: 'Pre-1.0 version' });
      }
    }
    return commonOutdated;
  }

  findVulnerableDependencies(dependencies) {
    // Simplified - in real implementation would use npm audit
    const commonVulnerable = [];
    const knownVulnerable = ['lodash', 'moment', 'request'];
    
    for (const dep of Object.keys(dependencies)) {
      if (knownVulnerable.some(vuln => dep.includes(vuln))) {
        commonVulnerable.push({ 
          name: dep, 
          version: dependencies[dep], 
          reason: 'Known vulnerable package' 
        });
      }
    }
    return commonVulnerable;
  }
}

module.exports = AnalysisUtilities;