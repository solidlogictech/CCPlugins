/**
 * Lighthouse Integration for Performance Auditing
 * Provides programmatic access to Lighthouse audits and web vitals analysis
 */

const fs = require('fs').promises;
const path = require('path');

class LighthouseIntegration {
  constructor() {
    this.defaultConfig = {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    };
  }

  /**
   * Check if Lighthouse is available
   */
  async isAvailable() {
    try {
      // Try to require lighthouse
      require.resolve('lighthouse');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Install Lighthouse if not available
   */
  async ensureLighthouseAvailable() {
    if (await this.isAvailable()) {
      return true;
    }

    console.log('Lighthouse not found. Installing...');
    try {
      const { execSync } = require('child_process');
      execSync('npm install lighthouse --no-save', { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error('Failed to install Lighthouse:', error.message);
      return false;
    }
  }

  /**
   * Run Lighthouse audit on a URL
   */
  async auditUrl(url, options = {}) {
    if (!await this.ensureLighthouseAvailable()) {
      throw new Error('Lighthouse is not available and could not be installed');
    }

    try {
      const lighthouse = require('lighthouse');
      const chromeLauncher = require('chrome-launcher');

      // Launch Chrome
      const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
      });

      // Configure Lighthouse
      const config = {
        ...this.defaultConfig,
        ...options.config
      };

      const lighthouseOptions = {
        logLevel: 'error',
        output: 'json',
        port: chrome.port,
        ...options.lighthouseOptions
      };

      // Run audit
      console.log(`Running Lighthouse audit on ${url}...`);
      const runnerResult = await lighthouse(url, lighthouseOptions, config);

      // Close Chrome
      await chrome.kill();

      return this.processLighthouseResults(runnerResult.lhr);
    } catch (error) {
      throw new Error(`Lighthouse audit failed: ${error.message}`);
    }
  }

  /**
   * Run Lighthouse audit on local development server
   */
  async auditLocalServer(port = 3000, path = '/', options = {}) {
    const url = `http://localhost:${port}${path}`;
    
    // Check if server is running
    if (!await this.isServerRunning(port)) {
      throw new Error(`No server running on port ${port}. Please start your development server first.`);
    }

    return await this.auditUrl(url, options);
  }

  /**
   * Run Lighthouse audit on built application
   */
  async auditBuiltApp(buildDir, options = {}) {
    // Start a simple static server for the built app
    const server = await this.startStaticServer(buildDir);
    
    try {
      const result = await this.auditUrl(`http://localhost:${server.port}`, options);
      await server.close();
      return result;
    } catch (error) {
      await server.close();
      throw error;
    }
  }

  /**
   * Process Lighthouse results into standardized format
   */
  processLighthouseResults(lhr) {
    const categories = lhr.categories;
    const audits = lhr.audits;

    return {
      // Overall scores
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100)
      },

      // Core Web Vitals
      webVitals: {
        lcp: audits['largest-contentful-paint']?.numericValue || 0,
        fid: audits['max-potential-fid']?.numericValue || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
        fcp: audits['first-contentful-paint']?.numericValue || 0,
        tbt: audits['total-blocking-time']?.numericValue || 0,
        si: audits['speed-index']?.numericValue || 0
      },

      // Performance metrics
      metrics: {
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0,
        timeToInteractive: audits['interactive']?.numericValue || 0,
        totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0
      },

      // Opportunities (performance improvements)
      opportunities: this.extractOpportunities(audits),

      // Diagnostics (performance issues)
      diagnostics: this.extractDiagnostics(audits),

      // Accessibility issues
      accessibilityIssues: this.extractAccessibilityIssues(audits),

      // Raw Lighthouse data for advanced analysis
      raw: {
        categories,
        audits,
        environment: lhr.environment,
        timing: lhr.timing
      }
    };
  }

  /**
   * Extract performance opportunities from audits
   */
  extractOpportunities(audits) {
    const opportunities = [];
    const opportunityAudits = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'duplicated-javascript'
    ];

    for (const auditId of opportunityAudits) {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          numericValue: audit.numericValue,
          displayValue: audit.displayValue,
          details: audit.details,
          savings: this.calculateSavings(audit)
        });
      }
    }

    return opportunities.sort((a, b) => (b.savings.timeMs || 0) - (a.savings.timeMs || 0));
  }

  /**
   * Extract performance diagnostics from audits
   */
  extractDiagnostics(audits) {
    const diagnostics = [];
    const diagnosticAudits = [
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'dom-size',
      'critical-request-chains',
      'user-timings',
      'third-party-summary'
    ];

    for (const auditId of diagnosticAudits) {
      const audit = audits[auditId];
      if (audit && (audit.score === null || audit.score < 1)) {
        diagnostics.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          numericValue: audit.numericValue,
          displayValue: audit.displayValue,
          details: audit.details
        });
      }
    }

    return diagnostics;
  }

  /**
   * Extract accessibility issues from audits
   */
  extractAccessibilityIssues(audits) {
    const issues = [];
    const accessibilityAudits = [
      'color-contrast',
      'image-alt',
      'label',
      'link-name',
      'button-name',
      'document-title',
      'html-has-lang',
      'meta-viewport'
    ];

    for (const auditId of accessibilityAudits) {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        issues.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          impact: this.getAccessibilityImpact(audit),
          details: audit.details
        });
      }
    }

    return issues.sort((a, b) => this.compareAccessibilityImpact(b.impact, a.impact));
  }

  /**
   * Calculate potential savings from optimization
   */
  calculateSavings(audit) {
    const savings = {
      timeMs: 0,
      bytes: 0
    };

    if (audit.details && audit.details.overallSavingsMs) {
      savings.timeMs = audit.details.overallSavingsMs;
    }

    if (audit.details && audit.details.overallSavingsBytes) {
      savings.bytes = audit.details.overallSavingsBytes;
    }

    return savings;
  }

  /**
   * Get accessibility impact level
   */
  getAccessibilityImpact(audit) {
    // Map audit IDs to impact levels
    const impactMap = {
      'color-contrast': 'serious',
      'image-alt': 'critical',
      'label': 'critical',
      'link-name': 'serious',
      'button-name': 'serious',
      'document-title': 'serious',
      'html-has-lang': 'serious',
      'meta-viewport': 'critical'
    };

    return impactMap[audit.id] || 'moderate';
  }

  /**
   * Compare accessibility impact levels
   */
  compareAccessibilityImpact(a, b) {
    const levels = { critical: 3, serious: 2, moderate: 1, minor: 0 };
    return (levels[a] || 0) - (levels[b] || 0);
  }

  /**
   * Generate performance regression analysis
   */
  async compareResults(currentResults, baselineResults) {
    const comparison = {
      summary: {
        improved: 0,
        regressed: 0,
        unchanged: 0
      },
      scores: {},
      webVitals: {},
      regressions: [],
      improvements: []
    };

    // Compare scores
    for (const [category, currentScore] of Object.entries(currentResults.scores)) {
      const baselineScore = baselineResults.scores[category] || 0;
      const difference = currentScore - baselineScore;

      comparison.scores[category] = {
        current: currentScore,
        baseline: baselineScore,
        difference,
        percentChange: baselineScore > 0 ? (difference / baselineScore) * 100 : 0
      };

      if (Math.abs(difference) < 2) {
        comparison.summary.unchanged++;
      } else if (difference > 0) {
        comparison.summary.improved++;
        comparison.improvements.push({
          category,
          improvement: difference,
          type: 'score'
        });
      } else {
        comparison.summary.regressed++;
        comparison.regressions.push({
          category,
          regression: Math.abs(difference),
          type: 'score'
        });
      }
    }

    // Compare Web Vitals
    for (const [metric, currentValue] of Object.entries(currentResults.webVitals)) {
      const baselineValue = baselineResults.webVitals[metric] || 0;
      const difference = currentValue - baselineValue;

      comparison.webVitals[metric] = {
        current: currentValue,
        baseline: baselineValue,
        difference,
        percentChange: baselineValue > 0 ? (difference / baselineValue) * 100 : 0
      };

      // For web vitals, lower is better (except for scores)
      const threshold = this.getWebVitalThreshold(metric);
      if (Math.abs(difference) > threshold) {
        if (difference > 0) { // Worse performance
          comparison.regressions.push({
            metric,
            regression: difference,
            type: 'webVital'
          });
        } else { // Better performance
          comparison.improvements.push({
            metric,
            improvement: Math.abs(difference),
            type: 'webVital'
          });
        }
      }
    }

    return comparison;
  }

  /**
   * Get threshold for web vital changes
   */
  getWebVitalThreshold(metric) {
    const thresholds = {
      lcp: 100, // 100ms
      fid: 10,  // 10ms
      cls: 0.01, // 0.01
      fcp: 100, // 100ms
      tbt: 50,  // 50ms
      si: 100   // 100ms
    };

    return thresholds[metric] || 50;
  }

  /**
   * Check if server is running on port
   */
  async isServerRunning(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const socket = new net.Socket();

      socket.setTimeout(1000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        resolve(false);
      });

      socket.connect(port, 'localhost');
    });
  }

  /**
   * Start static server for built application
   */
  async startStaticServer(buildDir) {
    const express = require('express');
    const app = express();

    app.use(express.static(buildDir));

    // Handle SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildDir, 'index.html'));
    });

    return new Promise((resolve, reject) => {
      const server = app.listen(0, (err) => {
        if (err) {
          reject(err);
        } else {
          const port = server.address().port;
          resolve({
            port,
            close: () => new Promise((resolveClose) => {
              server.close(resolveClose);
            })
          });
        }
      });
    });
  }

  /**
   * Generate optimization recommendations based on Lighthouse results
   */
  generateOptimizationRecommendations(results) {
    const recommendations = [];

    // Performance recommendations
    for (const opportunity of results.opportunities) {
      recommendations.push({
        type: 'performance',
        priority: this.getRecommendationPriority(opportunity.savings.timeMs),
        title: opportunity.title,
        description: opportunity.description,
        impact: `Potential savings: ${opportunity.displayValue}`,
        implementation: this.getImplementationGuide(opportunity.id)
      });
    }

    // Accessibility recommendations
    for (const issue of results.accessibilityIssues) {
      recommendations.push({
        type: 'accessibility',
        priority: issue.impact === 'critical' ? 'high' : 'medium',
        title: issue.title,
        description: issue.description,
        impact: `Accessibility impact: ${issue.impact}`,
        implementation: this.getAccessibilityImplementationGuide(issue.id)
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  }

  /**
   * Get recommendation priority based on potential savings
   */
  getRecommendationPriority(savingsMs) {
    if (savingsMs > 1000) return 'high';
    if (savingsMs > 500) return 'medium';
    return 'low';
  }

  /**
   * Get implementation guide for performance optimization
   */
  getImplementationGuide(auditId) {
    const guides = {
      'render-blocking-resources': 'Use async/defer attributes for scripts, inline critical CSS',
      'unused-css-rules': 'Remove unused CSS with tools like PurgeCSS or UnCSS',
      'unused-javascript': 'Use tree shaking and code splitting to remove unused code',
      'modern-image-formats': 'Convert images to WebP or AVIF formats',
      'offscreen-images': 'Implement lazy loading for images below the fold',
      'unminified-css': 'Minify CSS files in your build process',
      'unminified-javascript': 'Minify JavaScript files in your build process'
    };

    return guides[auditId] || 'Refer to Lighthouse documentation for implementation details';
  }

  /**
   * Get implementation guide for accessibility fixes
   */
  getAccessibilityImplementationGuide(auditId) {
    const guides = {
      'color-contrast': 'Ensure text has sufficient color contrast ratio (4.5:1 for normal text)',
      'image-alt': 'Add descriptive alt attributes to all images',
      'label': 'Associate form controls with labels using for/id attributes',
      'link-name': 'Ensure links have descriptive text or accessible names',
      'button-name': 'Ensure buttons have accessible names or text content',
      'document-title': 'Add a descriptive title to the document',
      'html-has-lang': 'Add lang attribute to html element',
      'meta-viewport': 'Add proper viewport meta tag for mobile responsiveness'
    };

    return guides[auditId] || 'Refer to WCAG guidelines for implementation details';
  }
}

module.exports = LighthouseIntegration;