/**
 * Unit tests for LighthouseIntegration
 */

const LighthouseIntegration = require('../../lib/integrations/lighthouse-integration');

// Mock lighthouse and chrome-launcher
jest.mock('lighthouse', () => jest.fn());
jest.mock('chrome-launcher', () => ({
  launch: jest.fn(),
}));

describe('LighthouseIntegration', () => {
  let integration;

  beforeEach(() => {
    integration = new LighthouseIntegration();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      expect(integration.defaultConfig).toBeDefined();
      expect(integration.defaultConfig.extends).toBe('lighthouse:default');
      expect(integration.defaultConfig.settings.onlyCategories).toContain('performance');
    });
  });

  describe('isAvailable', () => {
    it('should return true when lighthouse is available', async () => {
      // Mock require.resolve to succeed
      const originalResolve = require.resolve;
      require.resolve = jest.fn().mockReturnValue('/path/to/lighthouse');

      const result = await integration.isAvailable();

      expect(result).toBe(true);
      require.resolve = originalResolve;
    });

    it('should return false when lighthouse is not available', async () => {
      // Mock require.resolve to throw
      const originalResolve = require.resolve;
      require.resolve = jest.fn().mockImplementation(() => {
        throw new Error('Module not found');
      });

      const result = await integration.isAvailable();

      expect(result).toBe(false);
      require.resolve = originalResolve;
    });
  });

  describe('processLighthouseResults', () => {
    it('should process lighthouse results correctly', () => {
      const mockLhr = {
        categories: {
          performance: { score: 0.85 },
          accessibility: { score: 0.92 },
          'best-practices': { score: 0.88 },
          seo: { score: 0.90 }
        },
        audits: {
          'largest-contentful-paint': { numericValue: 2100 },
          'max-potential-fid': { numericValue: 80 },
          'cumulative-layout-shift': { numericValue: 0.05 },
          'first-contentful-paint': { numericValue: 1200 },
          'total-blocking-time': { numericValue: 150 },
          'speed-index': { numericValue: 2500 },
          'interactive': { numericValue: 3000 },
          'render-blocking-resources': {
            score: 0.5,
            title: 'Eliminate render-blocking resources',
            description: 'Resources are blocking the first paint',
            displayValue: 'Potential savings of 500ms',
            details: { overallSavingsMs: 500 }
          },
          'color-contrast': {
            score: 0.8,
            id: 'color-contrast',
            title: 'Background and foreground colors have sufficient contrast ratio',
            description: 'Low-contrast text is difficult to read'
          }
        },
        environment: { networkUserAgent: 'test' },
        timing: { total: 5000 }
      };

      const result = integration.processLighthouseResults(mockLhr);

      expect(result.scores.performance).toBe(85);
      expect(result.scores.accessibility).toBe(92);
      expect(result.webVitals.lcp).toBe(2100);
      expect(result.webVitals.fid).toBe(80);
      expect(result.webVitals.cls).toBe(0.05);
      expect(result.metrics.firstContentfulPaint).toBe(1200);
      expect(result.opportunities.length).toBeGreaterThan(0);
      expect(result.accessibilityIssues.length).toBeGreaterThan(0);
    });

    it('should handle missing audit data gracefully', () => {
      const mockLhr = {
        categories: {},
        audits: {},
        environment: {},
        timing: {}
      };

      const result = integration.processLighthouseResults(mockLhr);

      expect(result.scores.performance).toBe(0);
      expect(result.webVitals.lcp).toBe(0);
      expect(result.opportunities).toEqual([]);
      expect(result.accessibilityIssues).toEqual([]);
    });
  });

  describe('extractOpportunities', () => {
    it('should extract performance opportunities correctly', () => {
      const mockAudits = {
        'render-blocking-resources': {
          score: 0.5,
          title: 'Eliminate render-blocking resources',
          description: 'Resources are blocking the first paint',
          displayValue: 'Potential savings of 500ms',
          details: { overallSavingsMs: 500, overallSavingsBytes: 1024 }
        },
        'unused-css-rules': {
          score: 0.3,
          title: 'Remove unused CSS',
          description: 'Remove dead rules from stylesheets',
          displayValue: 'Potential savings of 200ms',
          details: { overallSavingsMs: 200 }
        },
        'passing-audit': {
          score: 1.0,
          title: 'This audit passes'
        }
      };

      const opportunities = integration.extractOpportunities(mockAudits);

      expect(opportunities).toHaveLength(2);
      expect(opportunities[0].title).toBe('Eliminate render-blocking resources');
      expect(opportunities[0].savings.timeMs).toBe(500);
      expect(opportunities[0].savings.bytes).toBe(1024);
      
      // Should be sorted by savings (highest first)
      expect(opportunities[0].savings.timeMs).toBeGreaterThan(opportunities[1].savings.timeMs);
    });
  });

  describe('extractAccessibilityIssues', () => {
    it('should extract accessibility issues correctly', () => {
      const mockAudits = {
        'color-contrast': {
          score: 0.8,
          id: 'color-contrast',
          title: 'Background and foreground colors have sufficient contrast ratio',
          description: 'Low-contrast text is difficult to read',
          details: { items: [{ node: { selector: '.low-contrast' } }] }
        },
        'image-alt': {
          score: 0.6,
          id: 'image-alt',
          title: 'Image elements have [alt] attributes',
          description: 'Informative elements should aim for short, descriptive alternate text',
          details: { items: [{ node: { selector: 'img' } }] }
        },
        'passing-audit': {
          score: 1.0,
          title: 'This audit passes'
        }
      };

      const issues = integration.extractAccessibilityIssues(mockAudits);

      expect(issues).toHaveLength(2);
      expect(issues[0].title).toBe('Image elements have [alt] attributes');
      expect(issues[0].impact).toBe('critical');
      expect(issues[1].title).toBe('Background and foreground colors have sufficient contrast ratio');
      expect(issues[1].impact).toBe('serious');
    });
  });

  describe('compareResults', () => {
    it('should compare performance results correctly', async () => {
      const currentResults = {
        scores: { performance: 85, accessibility: 90 },
        webVitals: { lcp: 2000, fid: 80, cls: 0.05 }
      };

      const baselineResults = {
        scores: { performance: 80, accessibility: 85 },
        webVitals: { lcp: 2500, fid: 100, cls: 0.08 }
      };

      const comparison = await integration.compareResults(currentResults, baselineResults);

      expect(comparison.summary.improved).toBe(2); // Both scores improved
      expect(comparison.summary.regressed).toBe(0);
      expect(comparison.scores.performance.difference).toBe(5);
      expect(comparison.webVitals.lcp.difference).toBe(-500); // Improvement (lower is better)
      expect(comparison.improvements.length).toBeGreaterThan(0);
    });

    it('should identify regressions correctly', async () => {
      const currentResults = {
        scores: { performance: 75 },
        webVitals: { lcp: 3000 }
      };

      const baselineResults = {
        scores: { performance: 85 },
        webVitals: { lcp: 2000 }
      };

      const comparison = await integration.compareResults(currentResults, baselineResults);

      expect(comparison.summary.regressed).toBeGreaterThan(0);
      expect(comparison.regressions.length).toBeGreaterThan(0);
    });
  });

  describe('generateOptimizationRecommendations', () => {
    it('should generate recommendations from lighthouse results', () => {
      const mockResults = {
        opportunities: [
          {
            id: 'render-blocking-resources',
            title: 'Eliminate render-blocking resources',
            description: 'Resources are blocking the first paint',
            displayValue: 'Potential savings of 500ms',
            savings: { timeMs: 500 }
          }
        ],
        accessibilityIssues: [
          {
            id: 'color-contrast',
            title: 'Background and foreground colors have sufficient contrast ratio',
            description: 'Low-contrast text is difficult to read',
            impact: 'serious'
          }
        ]
      };

      const recommendations = integration.generateOptimizationRecommendations(mockResults);

      expect(recommendations.length).toBe(2);
      expect(recommendations[0].type).toBe('performance');
      expect(recommendations[0].priority).toBe('medium'); // 500ms savings
      expect(recommendations[1].type).toBe('accessibility');
      expect(recommendations[1].priority).toBe('medium'); // serious impact
    });

    it('should prioritize recommendations correctly', () => {
      const mockResults = {
        opportunities: [
          {
            id: 'high-impact',
            title: 'High impact optimization',
            description: 'Major performance improvement',
            displayValue: 'Potential savings of 1500ms',
            savings: { timeMs: 1500 }
          },
          {
            id: 'low-impact',
            title: 'Low impact optimization',
            description: 'Minor performance improvement',
            displayValue: 'Potential savings of 100ms',
            savings: { timeMs: 100 }
          }
        ],
        accessibilityIssues: [
          {
            id: 'critical-issue',
            title: 'Critical accessibility issue',
            description: 'Critical accessibility problem',
            impact: 'critical'
          }
        ]
      };

      const recommendations = integration.generateOptimizationRecommendations(mockResults);

      // Should be sorted by priority (high first)
      expect(recommendations[0].priority).toBe('high'); // Critical accessibility or high performance
      expect(recommendations[recommendations.length - 1].priority).toBe('low'); // Low impact performance
    });
  });

  describe('helper methods', () => {
    it('should get correct recommendation priority', () => {
      expect(integration.getRecommendationPriority(1500)).toBe('high');
      expect(integration.getRecommendationPriority(750)).toBe('medium');
      expect(integration.getRecommendationPriority(200)).toBe('low');
    });

    it('should get web vital thresholds correctly', () => {
      expect(integration.getWebVitalThreshold('lcp')).toBe(100);
      expect(integration.getWebVitalThreshold('fid')).toBe(10);
      expect(integration.getWebVitalThreshold('cls')).toBe(0.01);
      expect(integration.getWebVitalThreshold('unknown')).toBe(50);
    });

    it('should get accessibility impact correctly', () => {
      const mockAudit = { id: 'color-contrast' };
      expect(integration.getAccessibilityImpact(mockAudit)).toBe('serious');

      const mockCriticalAudit = { id: 'image-alt' };
      expect(integration.getAccessibilityImpact(mockCriticalAudit)).toBe('critical');
    });

    it('should compare accessibility impact levels', () => {
      expect(integration.compareAccessibilityImpact('critical', 'serious')).toBe(1);
      expect(integration.compareAccessibilityImpact('serious', 'moderate')).toBe(1);
      expect(integration.compareAccessibilityImpact('moderate', 'critical')).toBe(-2);
    });

    it('should provide implementation guides', () => {
      const perfGuide = integration.getImplementationGuide('render-blocking-resources');
      expect(perfGuide).toContain('async/defer');

      const a11yGuide = integration.getAccessibilityImplementationGuide('color-contrast');
      expect(a11yGuide).toContain('contrast ratio');
    });
  });

  describe('server utilities', () => {
    it('should check if server is running', async () => {
      // Mock net module
      const mockSocket = {
        setTimeout: jest.fn(),
        on: jest.fn(),
        destroy: jest.fn(),
        connect: jest.fn()
      };

      const net = require('net');
      net.Socket = jest.fn(() => mockSocket);

      // Simulate successful connection
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'connect') {
          setTimeout(callback, 10);
        }
      });

      const isRunning = await integration.isServerRunning(3000);
      
      expect(mockSocket.connect).toHaveBeenCalledWith(3000, 'localhost');
    });
  });
});