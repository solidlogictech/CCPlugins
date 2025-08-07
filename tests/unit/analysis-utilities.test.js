/**
 * Unit tests for AnalysisUtilities
 */

const fs = require('fs').promises;
const path = require('path');
const AnalysisUtilities = require('../../lib/analysis-utilities');

// Mock fs
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    readdir: jest.fn()
  }
}));

describe('AnalysisUtilities', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new AnalysisUtilities();
    jest.clearAllMocks();
  });

  describe('detectProjectType', () => {
    it('should detect React project from package.json', async () => {
      const mockPackageJson = {
        dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.detectProjectType('/test/path');

      expect(result.primaryType).toBe('react');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.evidence).toContain('React dependency found');
    });

    it('should detect Vue project from package.json', async () => {
      const mockPackageJson = {
        dependencies: { vue: '^3.0.0' }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.detectProjectType('/test/path');

      expect(result.primaryType).toBe('vue');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.evidence).toContain('Vue dependency found');
    });

    it('should detect Angular project from package.json', async () => {
      const mockPackageJson = {
        dependencies: { '@angular/core': '^15.0.0' }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.detectProjectType('/test/path');

      expect(result.primaryType).toBe('angular');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.evidence).toContain('Angular dependency found');
    });

    it('should detect Express project from package.json', async () => {
      const mockPackageJson = {
        dependencies: { express: '^4.18.0' }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.detectProjectType('/test/path');

      expect(result.primaryType).toBe('express');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.evidence).toContain('Express dependency found');
    });

    it('should return unknown type when no package.json exists', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const result = await analyzer.detectProjectType('/test/path');

      expect(result.primaryType).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should handle corrupted package.json gracefully', async () => {
      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue('invalid json');

      const result = await analyzer.detectProjectType('/test/path');

      expect(result.primaryType).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should cache results for same path', async () => {
      const mockPackageJson = {
        dependencies: { react: '^18.0.0' }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      // First call
      await analyzer.detectProjectType('/test/path');
      // Second call
      const result = await analyzer.detectProjectType('/test/path');

      expect(fs.readFile).toHaveBeenCalledTimes(1); // Should be cached
      expect(result.primaryType).toBe('react');
    });
  });

  describe('detectFrameworks', () => {
    it('should detect multiple frameworks from dependencies', async () => {
      const mockPackageJson = {
        dependencies: { 
          react: '^18.0.0',
          express: '^4.18.0'
        },
        devDependencies: {
          typescript: '^4.9.0'
        }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.detectFrameworks('/test/path');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(fw => fw.name === 'React')).toBe(true);
      expect(result.some(fw => fw.name === 'Express')).toBe(true);
    });

    it('should return empty array when no package.json exists', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const result = await analyzer.detectFrameworks('/test/path');

      expect(result).toEqual([]);
    });

    it('should sort frameworks by confidence', async () => {
      const mockPackageJson = {
        dependencies: { 
          react: '^18.0.0',
          'react-dom': '^18.0.0' // Higher confidence for React
        },
        devDependencies: {
          vue: '^3.0.0' // Lower confidence
        }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.detectFrameworks('/test/path');

      expect(result[0].confidence).toBeGreaterThanOrEqual(result[1]?.confidence || 0);
    });
  });

  describe('analyzeTechnologyStack', () => {
    it('should analyze complete technology stack', async () => {
      const mockPackageJson = {
        dependencies: { 
          react: '^18.0.0',
          express: '^4.18.0',
          mongodb: '^4.0.0',
          redis: '^4.0.0'
        },
        devDependencies: {
          webpack: '^5.0.0',
          jest: '^29.0.0',
          typescript: '^4.9.0'
        }
      };

      // Mock file system calls
      fs.access.mockImplementation((filePath) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('File not found'));
      });

      fs.readFile.mockImplementation((filePath) => {
        if (filePath.includes('package.json')) {
          return Promise.resolve(JSON.stringify(mockPackageJson));
        }
        return Promise.reject(new Error('File not found'));
      });

      fs.readdir.mockResolvedValue([
        { name: 'src', isDirectory: () => true },
        { name: 'index.js', isDirectory: () => false },
        { name: 'app.tsx', isDirectory: () => false }
      ]);

      const result = await analyzer.analyzeTechnologyStack('/test/path');

      expect(result).toHaveProperty('languages');
      expect(result).toHaveProperty('frameworks');
      expect(result).toHaveProperty('databases');
      expect(result).toHaveProperty('tools');
      expect(result).toHaveProperty('buildTools');
      expect(result).toHaveProperty('cloudServices');

      expect(result.databases.length).toBeGreaterThan(0);
      expect(result.tools.length).toBeGreaterThan(0);
      expect(result.buildTools.length).toBeGreaterThan(0);
    });

    it('should handle missing package.json gracefully', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));
      fs.readdir.mockResolvedValue([]);

      const result = await analyzer.analyzeTechnologyStack('/test/path');

      expect(result.languages).toEqual([]);
      expect(result.frameworks).toEqual([]);
      expect(result.databases).toEqual([]);
    });
  });

  describe('analyzeDependencies', () => {
    it('should analyze dependency counts and health', async () => {
      const mockPackageJson = {
        dependencies: { 
          react: '^18.0.0',
          lodash: '^4.17.0', // Potentially vulnerable
          express: '^4.18.0'
        },
        devDependencies: {
          jest: '^29.0.0',
          webpack: '^0.8.0' // Outdated version
        }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await analyzer.analyzeDependencies('/test/path');

      expect(result.total).toBe(5);
      expect(result.production).toBe(3);
      expect(result.development).toBe(2);
      expect(result.outdated.length).toBeGreaterThan(0);
      expect(result.vulnerable.length).toBeGreaterThan(0);
    });

    it('should return empty analysis when no package.json exists', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const result = await analyzer.analyzeDependencies('/test/path');

      expect(result.total).toBe(0);
      expect(result.production).toBe(0);
      expect(result.development).toBe(0);
    });
  });

  describe('getProjectStructure', () => {
    it('should build project structure with depth limit', async () => {
      fs.readdir.mockImplementation((dirPath) => {
        if (dirPath.includes('/test/path')) {
          return Promise.resolve([
            { name: 'src', isDirectory: () => true },
            { name: 'package.json', isDirectory: () => false },
            { name: 'README.md', isDirectory: () => false },
            { name: 'node_modules', isDirectory: () => true } // Should be ignored
          ]);
        } else if (dirPath.includes('src')) {
          return Promise.resolve([
            { name: 'components', isDirectory: () => true },
            { name: 'index.js', isDirectory: () => false }
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await analyzer.getProjectStructure('/test/path', 2);

      expect(result.root).toBe('/test/path');
      expect(result.directories.length).toBeGreaterThan(0);
      expect(result.files.length).toBeGreaterThan(0);
      expect(result.totalFiles).toBeGreaterThan(0);
      expect(result.totalDirectories).toBeGreaterThan(0);
      
      // Should not include node_modules
      expect(result.directories.some(dir => dir.includes('node_modules'))).toBe(false);
    });

    it('should handle read errors gracefully', async () => {
      fs.readdir.mockRejectedValue(new Error('Permission denied'));

      const result = await analyzer.getProjectStructure('/test/path');

      expect(result.directories).toEqual([]);
      expect(result.files).toEqual([]);
      expect(result.totalFiles).toBe(0);
      expect(result.totalDirectories).toBe(0);
    });
  });

  describe('utility methods', () => {
    it('should check file existence correctly', async () => {
      fs.access.mockResolvedValue();

      const exists = await analyzer.fileExists('/test/file.txt');

      expect(exists).toBe(true);
      expect(fs.access).toHaveBeenCalledWith('/test/file.txt');
    });

    it('should return false for non-existent files', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const exists = await analyzer.fileExists('/test/nonexistent.txt');

      expect(exists).toBe(false);
    });

    it('should read and parse JSON files correctly', async () => {
      const mockData = { name: 'test', version: '1.0.0' };
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      const result = await analyzer.readJsonFile('/test/package.json');

      expect(result).toEqual(mockData);
      expect(fs.readFile).toHaveBeenCalledWith('/test/package.json', 'utf8');
    });

    it('should throw error for invalid JSON', async () => {
      fs.readFile.mockResolvedValue('invalid json');

      await expect(analyzer.readJsonFile('/test/invalid.json'))
        .rejects.toThrow('Failed to read JSON file');
    });

    it('should deduplicate frameworks correctly', () => {
      const frameworks = [
        { name: 'React', confidence: 0.9 },
        { name: 'Vue', confidence: 0.8 },
        { name: 'React', confidence: 0.7 } // Duplicate
      ];

      const result = analyzer.deduplicateFrameworks(frameworks);

      expect(result.length).toBe(2);
      expect(result.map(fw => fw.name)).toEqual(['React', 'Vue']);
    });

    it('should extract version correctly', () => {
      const dependencies = {
        react: '^18.0.0',
        vue: '~3.2.0'
      };

      expect(analyzer.extractVersion(dependencies, 'react')).toBe('^18.0.0');
      expect(analyzer.extractVersion(dependencies, 'angular')).toBe('unknown');
    });

    it('should map database names correctly', () => {
      expect(analyzer.getDatabaseName('mongodb')).toBe('MongoDB');
      expect(analyzer.getDatabaseName('pg')).toBe('PostgreSQL');
      expect(analyzer.getDatabaseName('unknown')).toBe('unknown');
    });

    it('should categorize tools correctly', () => {
      expect(analyzer.getToolCategory('webpack')).toBe('bundler');
      expect(analyzer.getToolCategory('jest')).toBe('testing');
      expect(analyzer.getToolCategory('eslint')).toBe('linter');
      expect(analyzer.getToolCategory('unknown')).toBe('tool');
    });
  });
});