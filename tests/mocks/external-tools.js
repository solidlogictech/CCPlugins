/**
 * Mock External Tool Integrations
 * Provides mock implementations of external tools for testing
 */

class MockExternalTools {
  constructor() {
    this.mocks = new Map();
    this.setupDefaultMocks();
  }

  /**
   * Setup default mock implementations
   */
  setupDefaultMocks() {
    // Mock Lighthouse
    this.mocks.set('lighthouse', {
      audit: jest.fn().mockResolvedValue({
        lhr: {
          categories: {
            performance: { score: 0.85 },
            accessibility: { score: 0.92 },
            'best-practices': { score: 0.88 },
            seo: { score: 0.90 }
          },
          audits: {
            'first-contentful-paint': { numericValue: 1200 },
            'largest-contentful-paint': { numericValue: 2100 },
            'cumulative-layout-shift': { numericValue: 0.05 },
            'total-blocking-time': { numericValue: 150 }
          }
        }
      })
    });

    // Mock webpack-bundle-analyzer
    this.mocks.set('webpack-bundle-analyzer', {
      BundleAnalyzerPlugin: jest.fn().mockImplementation(() => ({
        apply: jest.fn()
      })),
      analyze: jest.fn().mockResolvedValue({
        bundleSize: 1024000, // 1MB
        chunks: [
          { name: 'main', size: 512000 },
          { name: 'vendor', size: 256000 },
          { name: 'runtime', size: 256000 }
        ],
        assets: [
          { name: 'main.js', size: 512000 },
          { name: 'vendor.js', size: 256000 },
          { name: 'runtime.js', size: 256000 }
        ]
      })
    });

    // Mock axe-core
    this.mocks.set('axe-core', {
      run: jest.fn().mockResolvedValue({
        violations: [
          {
            id: 'color-contrast',
            impact: 'serious',
            description: 'Elements must have sufficient color contrast',
            nodes: [
              {
                target: ['.low-contrast-text'],
                html: '<p class="low-contrast-text">Hard to read text</p>'
              }
            ]
          }
        ],
        passes: [
          {
            id: 'alt-text',
            description: 'Images must have alternate text'
          }
        ],
        incomplete: [],
        inapplicable: []
      })
    });

    // Mock Playwright
    this.mocks.set('playwright', {
      chromium: {
        launch: jest.fn().mockResolvedValue({
          newPage: jest.fn().mockResolvedValue({
            goto: jest.fn().mockResolvedValue(),
            screenshot: jest.fn().mockResolvedValue(Buffer.from('mock-screenshot')),
            close: jest.fn().mockResolvedValue()
          }),
          close: jest.fn().mockResolvedValue()
        })
      }
    });

    // Mock Docker
    this.mocks.set('docker', {
      analyzeDockerfile: jest.fn().mockResolvedValue({
        baseImage: 'node:18-alpine',
        layers: 8,
        size: '150MB',
        vulnerabilities: [
          {
            severity: 'medium',
            package: 'openssl',
            version: '1.1.1k',
            description: 'OpenSSL vulnerability'
          }
        ],
        recommendations: [
          'Use multi-stage builds to reduce image size',
          'Update base image to latest version',
          'Remove unnecessary packages'
        ]
      })
    });

    // Mock Database analyzers
    this.mocks.set('database', {
      postgresql: {
        explain: jest.fn().mockResolvedValue({
          'QUERY PLAN': [
            'Seq Scan on users  (cost=0.00..15.00 rows=1000 width=32)',
            'Planning Time: 0.123 ms',
            'Execution Time: 2.456 ms'
          ]
        }),
        analyzeQuery: jest.fn().mockResolvedValue({
          executionTime: 2.456,
          cost: 15.00,
          rows: 1000,
          recommendations: [
            'Add index on email column',
            'Consider using LIMIT clause'
          ]
        })
      },
      mysql: {
        explain: jest.fn().mockResolvedValue({
          id: 1,
          select_type: 'SIMPLE',
          table: 'users',
          type: 'ALL',
          possible_keys: null,
          key: null,
          rows: 1000
        })
      }
    });

    // Mock OpenAPI generators
    this.mocks.set('openapi', {
      generateSpec: jest.fn().mockResolvedValue({
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/api/users': {
            get: {
              summary: 'Get all users',
              responses: {
                '200': {
                  description: 'List of users',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        }
      })
    });

    // Mock i18n extractors
    this.mocks.set('i18n', {
      extractStrings: jest.fn().mockResolvedValue({
        strings: [
          { key: 'welcome.title', value: 'Welcome', file: 'src/components/Home.tsx' },
          { key: 'user.name', value: 'Name', file: 'src/components/UserForm.tsx' },
          { key: 'button.submit', value: 'Submit', file: 'src/components/Form.tsx' }
        ],
        totalStrings: 3,
        filesScanned: 15
      }),
      validateTranslations: jest.fn().mockResolvedValue({
        missing: [
          { key: 'welcome.title', locale: 'es' },
          { key: 'user.name', locale: 'fr' }
        ],
        unused: [
          { key: 'old.key', locale: 'en' }
        ],
        totalKeys: 50,
        coverage: {
          en: 100,
          es: 94,
          fr: 96
        }
      })
    });

    // Mock Git analysis tools
    this.mocks.set('git', {
      analyzeHistory: jest.fn().mockResolvedValue({
        totalCommits: 150,
        contributors: 5,
        branches: ['main', 'develop', 'feature/user-auth'],
        lastCommit: {
          hash: 'abc123',
          message: 'Add user authentication',
          author: 'John Doe',
          date: '2023-01-15T10:30:00Z'
        },
        hotspots: [
          { file: 'src/utils/auth.js', changes: 25 },
          { file: 'src/components/UserForm.tsx', changes: 18 }
        ]
      }),
      analyzeConflicts: jest.fn().mockResolvedValue({
        conflictFiles: [
          'src/config/database.js',
          'package.json'
        ],
        resolutionStrategies: [
          {
            file: 'src/config/database.js',
            strategy: 'merge',
            confidence: 0.8
          }
        ]
      })
    });

    // Mock Performance monitoring tools
    this.mocks.set('monitoring', {
      setupDatadog: jest.fn().mockResolvedValue({
        apiKey: 'mock-api-key',
        dashboards: ['app-performance', 'error-tracking'],
        alerts: ['high-error-rate', 'slow-response-time']
      }),
      setupSentry: jest.fn().mockResolvedValue({
        dsn: 'https://mock-dsn@sentry.io/project',
        environment: 'development',
        release: '1.0.0'
      })
    });
  }

  /**
   * Get mock for specific tool
   */
  getMock(toolName) {
    return this.mocks.get(toolName);
  }

  /**
   * Set custom mock for tool
   */
  setMock(toolName, mockImplementation) {
    this.mocks.set(toolName, mockImplementation);
  }

  /**
   * Reset all mocks
   */
  resetMocks() {
    for (const mock of this.mocks.values()) {
      if (typeof mock === 'object') {
        for (const method of Object.values(mock)) {
          if (jest.isMockFunction(method)) {
            method.mockReset();
          }
        }
      }
    }
  }

  /**
   * Clear all mocks
   */
  clearMocks() {
    for (const mock of this.mocks.values()) {
      if (typeof mock === 'object') {
        for (const method of Object.values(mock)) {
          if (jest.isMockFunction(method)) {
            method.mockClear();
          }
        }
      }
    }
  }

  /**
   * Mock tool availability check
   */
  mockToolAvailability(toolName, available = true) {
    const availabilityMock = jest.fn().mockResolvedValue(available);
    
    if (!this.mocks.has(toolName)) {
      this.mocks.set(toolName, {});
    }
    
    this.mocks.get(toolName).isAvailable = availabilityMock;
    return availabilityMock;
  }

  /**
   * Mock tool execution with custom response
   */
  mockToolExecution(toolName, method, response, shouldReject = false) {
    if (!this.mocks.has(toolName)) {
      this.mocks.set(toolName, {});
    }

    const mock = shouldReject 
      ? jest.fn().mockRejectedValue(response)
      : jest.fn().mockResolvedValue(response);

    this.mocks.get(toolName)[method] = mock;
    return mock;
  }

  /**
   * Create mock command line tool
   */
  createMockCLI(toolName, commands = {}) {
    const cliMock = {
      exec: jest.fn(),
      spawn: jest.fn(),
      isInstalled: jest.fn().mockResolvedValue(true)
    };

    // Setup command-specific mocks
    for (const [command, response] of Object.entries(commands)) {
      cliMock.exec.mockImplementation((cmd) => {
        if (cmd.includes(command)) {
          return Promise.resolve(response);
        }
        return Promise.reject(new Error(`Unknown command: ${cmd}`));
      });
    }

    this.mocks.set(toolName, cliMock);
    return cliMock;
  }

  /**
   * Mock file system operations for tools
   */
  mockFileOperations() {
    return {
      readConfig: jest.fn().mockResolvedValue({}),
      writeConfig: jest.fn().mockResolvedValue(true),
      createFile: jest.fn().mockResolvedValue(true),
      deleteFile: jest.fn().mockResolvedValue(true),
      copyFile: jest.fn().mockResolvedValue(true),
      exists: jest.fn().mockResolvedValue(true)
    };
  }

  /**
   * Mock network operations for tools
   */
  mockNetworkOperations() {
    return {
      httpGet: jest.fn().mockResolvedValue({ status: 200, data: {} }),
      httpPost: jest.fn().mockResolvedValue({ status: 201, data: {} }),
      downloadFile: jest.fn().mockResolvedValue(true),
      uploadFile: jest.fn().mockResolvedValue(true),
      checkConnectivity: jest.fn().mockResolvedValue(true)
    };
  }

  /**
   * Get all available mocks
   */
  getAllMocks() {
    return Object.fromEntries(this.mocks);
  }

  /**
   * Setup mock environment for testing
   */
  setupTestEnvironment() {
    // Mock process.env
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      CI: 'true',
      LIGHTHOUSE_CHROMIUM_PATH: '/mock/chromium',
      DOCKER_HOST: 'unix:///var/run/docker.sock'
    };

    // Mock console methods to reduce noise in tests
    const originalConsole = console;
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();

    return {
      restore: () => {
        process.env = originalEnv;
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
      }
    };
  }
}

module.exports = MockExternalTools;