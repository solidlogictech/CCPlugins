/**
 * Mock Claude Code CLI Tools
 * Provides mock implementations of Claude's native tools for testing
 */

const fs = require('fs').promises;
const path = require('path');

// Mock tool implementations
const mockTools = {
  grep: jest.fn(),
  read: jest.fn(),
  write: jest.fn(),
  glob: jest.fn(),
  todoWrite: jest.fn(),
  task: jest.fn()
};

// Mock file system state
let mockFileSystem = new Map();
let mockProjectStructure = {};

/**
 * Initialize mock Claude tools with realistic behavior
 */
function mockClaudeTools() {
  // Mock Grep tool - pattern matching across files
  mockTools.grep.mockImplementation(async (pattern, options = {}) => {
    const { includePattern, excludePattern, caseSensitive = false } = options;
    const results = [];
    
    for (const [filePath, content] of mockFileSystem.entries()) {
      if (includePattern && !filePath.match(includePattern)) continue;
      if (excludePattern && filePath.match(excludePattern)) continue;
      
      const lines = content.split('\n');
      const regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
      
      lines.forEach((line, index) => {
        if (regex.test(line)) {
          results.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            context: {
              before: lines[index - 1] || '',
              after: lines[index + 1] || ''
            }
          });
        }
      });
    }
    
    return results;
  });

  // Mock Read tool - file content reading
  mockTools.read.mockImplementation(async (filePath, options = {}) => {
    const { startLine, endLine } = options;
    
    if (!mockFileSystem.has(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    let content = mockFileSystem.get(filePath);
    
    if (startLine || endLine) {
      const lines = content.split('\n');
      const start = startLine ? startLine - 1 : 0;
      const end = endLine ? endLine : lines.length;
      content = lines.slice(start, end).join('\n');
    }
    
    return content;
  });

  // Mock Write tool - file writing
  mockTools.write.mockImplementation(async (filePath, content) => {
    // Ensure directory exists in mock file system
    const dir = path.dirname(filePath);
    if (!mockFileSystem.has(dir)) {
      mockFileSystem.set(dir, ''); // Mock directory
    }
    
    mockFileSystem.set(filePath, content);
    return { success: true, path: filePath, size: content.length };
  });

  // Mock Glob tool - file discovery
  mockTools.glob.mockImplementation(async (pattern, options = {}) => {
    const { depth, excludePattern } = options;
    const results = [];
    
    for (const filePath of mockFileSystem.keys()) {
      if (excludePattern && filePath.match(excludePattern)) continue;
      
      // Simple pattern matching (could be enhanced)
      if (pattern === '**/*' || filePath.includes(pattern.replace('*', ''))) {
        const stats = {
          path: filePath,
          isFile: !filePath.endsWith('/'),
          isDirectory: filePath.endsWith('/'),
          size: mockFileSystem.get(filePath)?.length || 0,
          modified: new Date().toISOString()
        };
        results.push(stats);
      }
    }
    
    return results;
  });

  // Mock TodoWrite tool - progress tracking
  mockTools.todoWrite.mockImplementation(async (filePath, todos) => {
    const content = todos.map(todo => 
      `- [${todo.completed ? 'x' : ' '}] ${todo.title}\n  ${todo.description || ''}`
    ).join('\n');
    
    await mockTools.write(filePath, content);
    return { success: true, todos: todos.length };
  });

  // Mock Task tool - sub-agent orchestration
  mockTools.task.mockImplementation(async (taskType, params) => {
    // Simulate different task types
    switch (taskType) {
      case 'security-analysis':
        return {
          vulnerabilities: [],
          recommendations: ['Use HTTPS', 'Validate inputs'],
          score: 85
        };
      case 'performance-analysis':
        return {
          bottlenecks: ['Database queries', 'Large file processing'],
          optimizations: ['Add caching', 'Optimize queries'],
          score: 78
        };
      case 'quality-analysis':
        return {
          issues: ['Complex functions', 'Missing tests'],
          improvements: ['Refactor large functions', 'Add unit tests'],
          score: 82
        };
      default:
        return { success: true, result: 'Task completed' };
    }
  });

  return mockTools;
}

/**
 * Reset all mocks to clean state
 */
function resetMocks() {
  Object.values(mockTools).forEach(mock => mock.mockReset());
  mockFileSystem.clear();
  mockProjectStructure = {};
}

/**
 * Set up mock project structure for testing
 */
function setupMockProject(projectType, options = {}) {
  mockFileSystem.clear();
  
  switch (projectType) {
    case 'react-express-app':
      setupReactExpressProject(options);
      break;
    case 'large-enterprise-app':
      setupLargeEnterpriseProject(options);
      break;
    case 'microservices-architecture':
      setupMicroservicesProject(options);
      break;
    case 'minimal-project':
      setupMinimalProject(options);
      break;
    default:
      setupBasicProject(options);
  }
  
  return mockProjectStructure;
}

function setupReactExpressProject(options) {
  const files = {
    'package.json': JSON.stringify({
      name: 'react-express-app',
      dependencies: {
        'react': '^18.0.0',
        'express': '^4.18.0',
        'jsonwebtoken': '^8.5.1',
        'joi': '^17.6.0'
      }
    }),
    'src/App.js': `
      import React from 'react';
      import { BrowserRouter as Router } from 'react-router-dom';
      
      function App() {
        return <Router><div>App</div></Router>;
      }
      
      export default App;
    `,
    'src/components/Button.js': `
      import React from 'react';
      
      const Button = ({ children, onClick, variant = 'primary' }) => {
        return (
          <button className={\`btn btn-\${variant}\`} onClick={onClick}>
            {children}
          </button>
        );
      };
      
      export default Button;
    `,
    'server/app.js': `
      const express = require('express');
      const jwt = require('jsonwebtoken');
      const Joi = require('joi');
      
      const app = express();
      
      app.use(express.json());
      
      const authenticateToken = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.sendStatus(401);
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.sendStatus(403);
          req.user = user;
          next();
        });
      };
      
      app.post('/api/users', authenticateToken, (req, res) => {
        const schema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required()
        });
        
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        
        res.json({ success: true });
      });
      
      module.exports = app;
    `,
    'server/models/User.js': `
      const { DataTypes } = require('sequelize');
      
      module.exports = (sequelize) => {
        const User = sequelize.define('User', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          }
        });
        
        return User;
      };
    `,
    'tests/Button.test.js': `
      import React from 'react';
      import { render, fireEvent } from '@testing-library/react';
      import Button from '../src/components/Button';
      
      describe('Button', () => {
        it('should render with default props', () => {
          const { getByText } = render(<Button>Click me</Button>);
          expect(getByText('Click me')).toBeInTheDocument();
        });
        
        it('should call onClick when clicked', () => {
          const handleClick = jest.fn();
          const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
          fireEvent.click(getByText('Click me'));
          expect(handleClick).toHaveBeenCalledTimes(1);
        });
      });
    `
  };
  
  Object.entries(files).forEach(([path, content]) => {
    mockFileSystem.set(path, content);
  });
  
  mockProjectStructure = {
    type: 'react-express-app',
    framework: 'React',
    backend: 'Node.js/Express',
    database: 'PostgreSQL',
    authentication: 'JWT',
    validation: 'Joi',
    testing: 'Jest + React Testing Library'
  };
}

function setupLargeEnterpriseProject(options) {
  const { files = 2847, directories = 156 } = options;
  
  // Generate large number of mock files
  for (let i = 1; i <= files; i++) {
    const dir = `src/module${Math.floor(i / 20) + 1}`;
    const filename = `${dir}/Component${i}.js`;
    const content = `
      // Component ${i}
      import React from 'react';
      
      const Component${i} = () => {
        return <div>Component ${i}</div>;
      };
      
      export default Component${i};
    `;
    mockFileSystem.set(filename, content);
  }
  
  // Add configuration files
  mockFileSystem.set('package.json', JSON.stringify({
    name: 'large-enterprise-app',
    dependencies: { /* many dependencies */ }
  }));
  
  mockProjectStructure = {
    type: 'large-enterprise-app',
    files,
    directories,
    complexity: 'high'
  };
}

function setupMicroservicesProject(options) {
  const { services = 15 } = options;
  
  for (let i = 1; i <= services; i++) {
    const serviceDir = `services/service-${i}`;
    mockFileSystem.set(`${serviceDir}/package.json`, JSON.stringify({
      name: `service-${i}`,
      dependencies: {}
    }));
    mockFileSystem.set(`${serviceDir}/src/index.js`, `
      // Service ${i}
      const express = require('express');
      const app = express();
      
      app.get('/health', (req, res) => {
        res.json({ status: 'healthy', service: 'service-${i}' });
      });
      
      module.exports = app;
    `);
  }
  
  mockProjectStructure = {
    type: 'microservices-architecture',
    services,
    complexity: 'high'
  };
}

function setupMinimalProject(options) {
  mockFileSystem.set('index.js', 'console.log("Hello World");');
  mockFileSystem.set('package.json', JSON.stringify({
    name: 'minimal-project',
    version: '1.0.0'
  }));
  
  mockProjectStructure = {
    type: 'minimal-project',
    complexity: 'low'
  };
}

function setupBasicProject(options) {
  const files = {
    'package.json': JSON.stringify({
      name: 'basic-project',
      dependencies: {}
    }),
    'src/index.js': 'console.log("Basic project");',
    'README.md': '# Basic Project\n\nA basic project for testing.'
  };
  
  Object.entries(files).forEach(([path, content]) => {
    mockFileSystem.set(path, content);
  });
  
  mockProjectStructure = {
    type: 'basic-project',
    complexity: 'low'
  };
}

/**
 * Get mock file system state for inspection
 */
function getMockFileSystem() {
  return new Map(mockFileSystem);
}

/**
 * Add files to mock file system
 */
function addMockFiles(files) {
  Object.entries(files).forEach(([path, content]) => {
    mockFileSystem.set(path, content);
  });
}

/**
 * Remove files from mock file system
 */
function removeMockFiles(paths) {
  paths.forEach(path => mockFileSystem.delete(path));
}

module.exports = {
  mockClaudeTools,
  resetMocks,
  setupMockProject,
  getMockFileSystem,
  addMockFiles,
  removeMockFiles,
  mockTools
};