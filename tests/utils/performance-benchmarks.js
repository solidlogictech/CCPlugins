/**
 * Performance Benchmarking Utilities
 * Provides tools for measuring and comparing command performance
 */

const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

class PerformanceBenchmarks {
  constructor() {
    this.benchmarks = new Map();
    this.thresholds = {
      commandExecution: 5000, // 5 seconds
      sessionLoad: 1000, // 1 second
      analysisPhase: 10000, // 10 seconds
      memoryUsage: 100 * 1024 * 1024, // 100MB
      fileOperations: 500 // 500ms
    };
  }

  /**
   * Start a benchmark measurement
   */
  start(benchmarkName) {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    this.benchmarks.set(benchmarkName, {
      startTime,
      startMemory,
      endTime: null,
      endMemory: null,
      duration: null,
      memoryDelta: null,
      metadata: {}
    });

    return benchmarkName;
  }

  /**
   * End a benchmark measurement
   */
  end(benchmarkName, metadata = {}) {
    const benchmark = this.benchmarks.get(benchmarkName);
    if (!benchmark) {
      throw new Error(`Benchmark '${benchmarkName}' not found`);
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    benchmark.endTime = endTime;
    benchmark.endMemory = endMemory;
    benchmark.duration = endTime - benchmark.startTime;
    benchmark.memoryDelta = {
      rss: endMemory.rss - benchmark.startMemory.rss,
      heapUsed: endMemory.heapUsed - benchmark.startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - benchmark.startMemory.heapTotal,
      external: endMemory.external - benchmark.startMemory.external
    };
    benchmark.metadata = metadata;

    return this.getBenchmarkResult(benchmarkName);
  }

  /**
   * Measure execution time of a function
   */
  async measure(name, fn, metadata = {}) {
    this.start(name);
    
    try {
      const result = await fn();
      const benchmark = this.end(name, metadata);
      return { result, benchmark };
    } catch (error) {
      this.end(name, { ...metadata, error: error.message });
      throw error;
    }
  }

  /**
   * Get benchmark result
   */
  getBenchmarkResult(benchmarkName) {
    const benchmark = this.benchmarks.get(benchmarkName);
    if (!benchmark) {
      return null;
    }

    return {
      name: benchmarkName,
      duration: benchmark.duration,
      memoryDelta: benchmark.memoryDelta,
      startMemory: benchmark.startMemory,
      endMemory: benchmark.endMemory,
      metadata: benchmark.metadata,
      passed: this.checkThresholds(benchmarkName, benchmark),
      thresholds: this.getApplicableThresholds(benchmarkName)
    };
  }

  /**
   * Get all benchmark results
   */
  getAllResults() {
    const results = [];
    for (const [name] of this.benchmarks) {
      results.push(this.getBenchmarkResult(name));
    }
    return results.sort((a, b) => b.duration - a.duration);
  }

  /**
   * Check if benchmark passes thresholds
   */
  checkThresholds(benchmarkName, benchmark) {
    const thresholds = this.getApplicableThresholds(benchmarkName);
    const checks = {
      duration: true,
      memory: true
    };

    if (thresholds.duration && benchmark.duration > thresholds.duration) {
      checks.duration = false;
    }

    if (thresholds.memory && benchmark.memoryDelta.heapUsed > thresholds.memory) {
      checks.memory = false;
    }

    return checks.duration && checks.memory;
  }

  /**
   * Get applicable thresholds for benchmark
   */
  getApplicableThresholds(benchmarkName) {
    const thresholds = {};

    // Determine thresholds based on benchmark name patterns
    if (benchmarkName.includes('command') || benchmarkName.includes('execute')) {
      thresholds.duration = this.thresholds.commandExecution;
      thresholds.memory = this.thresholds.memoryUsage;
    } else if (benchmarkName.includes('session') || benchmarkName.includes('load')) {
      thresholds.duration = this.thresholds.sessionLoad;
      thresholds.memory = this.thresholds.memoryUsage / 2;
    } else if (benchmarkName.includes('analysis') || benchmarkName.includes('analyze')) {
      thresholds.duration = this.thresholds.analysisPhase;
      thresholds.memory = this.thresholds.memoryUsage;
    } else if (benchmarkName.includes('file') || benchmarkName.includes('io')) {
      thresholds.duration = this.thresholds.fileOperations;
      thresholds.memory = this.thresholds.memoryUsage / 4;
    }

    return thresholds;
  }

  /**
   * Set custom threshold
   */
  setThreshold(type, value) {
    this.thresholds[type] = value;
  }

  /**
   * Compare benchmarks
   */
  compare(benchmark1Name, benchmark2Name) {
    const b1 = this.getBenchmarkResult(benchmark1Name);
    const b2 = this.getBenchmarkResult(benchmark2Name);

    if (!b1 || !b2) {
      throw new Error('One or both benchmarks not found');
    }

    return {
      duration: {
        difference: b1.duration - b2.duration,
        percentChange: ((b1.duration - b2.duration) / b2.duration) * 100,
        faster: b1.duration < b2.duration ? benchmark1Name : benchmark2Name
      },
      memory: {
        difference: b1.memoryDelta.heapUsed - b2.memoryDelta.heapUsed,
        percentChange: ((b1.memoryDelta.heapUsed - b2.memoryDelta.heapUsed) / b2.memoryDelta.heapUsed) * 100,
        efficient: b1.memoryDelta.heapUsed < b2.memoryDelta.heapUsed ? benchmark1Name : benchmark2Name
      }
    };
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const results = this.getAllResults();
    const totalBenchmarks = results.length;
    const passedBenchmarks = results.filter(r => r.passed).length;
    const failedBenchmarks = totalBenchmarks - passedBenchmarks;

    const report = {
      summary: {
        total: totalBenchmarks,
        passed: passedBenchmarks,
        failed: failedBenchmarks,
        passRate: totalBenchmarks > 0 ? (passedBenchmarks / totalBenchmarks) * 100 : 0
      },
      slowest: results.slice(0, 5),
      fastest: results.slice(-5).reverse(),
      memoryIntensive: results.sort((a, b) => b.memoryDelta.heapUsed - a.memoryDelta.heapUsed).slice(0, 5),
      failed: results.filter(r => !r.passed),
      thresholds: this.thresholds
    };

    return report;
  }

  /**
   * Save benchmark results to file
   */
  async saveResults(filePath) {
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage()
      },
      benchmarks: this.getAllResults(),
      report: this.generateReport()
    };

    await fs.writeFile(filePath, JSON.stringify(results, null, 2));
    return filePath;
  }

  /**
   * Load benchmark results from file
   */
  async loadResults(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load benchmark results: ${error.message}`);
    }
  }

  /**
   * Clear all benchmarks
   */
  clear() {
    this.benchmarks.clear();
  }

  /**
   * Create benchmark suite for command testing
   */
  createCommandSuite(commandName) {
    return {
      measureSetup: async (setupFn) => {
        return await this.measure(`${commandName}-setup`, setupFn);
      },
      measureDiscovery: async (discoveryFn) => {
        return await this.measure(`${commandName}-discovery`, discoveryFn);
      },
      measureAnalysis: async (analysisFn) => {
        return await this.measure(`${commandName}-analysis`, analysisFn);
      },
      measureExecution: async (executionFn) => {
        return await this.measure(`${commandName}-execution`, executionFn);
      },
      measureValidation: async (validationFn) => {
        return await this.measure(`${commandName}-validation`, validationFn);
      },
      measureComplete: async (completeFn) => {
        return await this.measure(`${commandName}-complete`, completeFn);
      }
    };
  }

  /**
   * Stress test a function
   */
  async stressTest(name, fn, iterations = 100, concurrency = 10) {
    const results = [];
    const batches = Math.ceil(iterations / concurrency);

    for (let batch = 0; batch < batches; batch++) {
      const batchPromises = [];
      const batchSize = Math.min(concurrency, iterations - batch * concurrency);

      for (let i = 0; i < batchSize; i++) {
        const iterationName = `${name}-stress-${batch * concurrency + i}`;
        batchPromises.push(this.measure(iterationName, fn));
      }

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }

    return this.analyzeStressTestResults(name, results);
  }

  /**
   * Analyze stress test results
   */
  analyzeStressTestResults(testName, results) {
    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    
    const durations = successful.map(r => r.value.benchmark.duration);
    const memoryUsages = successful.map(r => r.value.benchmark.memoryDelta.heapUsed);

    const analysis = {
      testName,
      totalIterations: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: (successful.length / results.length) * 100,
      duration: {
        min: Math.min(...durations),
        max: Math.max(...durations),
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
        median: this.calculateMedian(durations),
        p95: this.calculatePercentile(durations, 95),
        p99: this.calculatePercentile(durations, 99)
      },
      memory: {
        min: Math.min(...memoryUsages),
        max: Math.max(...memoryUsages),
        avg: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
        median: this.calculateMedian(memoryUsages)
      },
      errors: failed.map(r => r.reason?.message || 'Unknown error')
    };

    return analysis;
  }

  // Utility methods
  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  calculatePercentile(values, percentile) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Format duration for display
   */
  formatDuration(ms) {
    if (ms < 1000) {
      return `${ms.toFixed(2)}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Format memory usage for display
   */
  formatMemory(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = Math.abs(bytes);
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const sign = bytes < 0 ? '-' : '';
    return `${sign}${size.toFixed(2)}${units[unitIndex]}`;
  }
}

module.exports = PerformanceBenchmarks;