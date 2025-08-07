# Performance Audit

I'll analyze your web application's performance and provide optimization recommendations with comprehensive metrics and actionable insights.

Arguments: `$ARGUMENTS` - specific performance focus areas or options

## Session Intelligence

I'll maintain performance audit progress across sessions:

**Session Files (in current project directory):**
- `performance-audit/analysis.md` - Performance metrics and recommendations
- `performance-audit/state.json` - Baseline metrics and progress tracking

**IMPORTANT:** Session files are stored in a `performance-audit` folder in your current project root

**Auto-Detection:**
- If session exists: Resume performance analysis
- If no session: Create new performance audit
- Commands: `resume`, `baseline`, `compare`

## Phase 1: Initial Setup & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `performance-audit` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `performance-audit/state.json`
   - Look for `performance-audit/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze project structure and build configuration
   - Create performance audit plan
   - Initialize baseline metrics
4. Show performance analysis preview before execution

**Performance Context Analysis:**
- Use **Glob** to find build configuration files (webpack.config.js, vite.config.js, etc.)
- Use **Read** to analyze package.json for build scripts and dependencies
- Use **Grep** to identify performance-related configurations
- Analyze bundle output directories and asset patterns

## Phase 2: Bundle Size Analysis

### Extended Thinking for Complex Performance Scenarios

For complex performance optimization scenarios, I'll use extended thinking:

<think>
When analyzing complex performance issues:
- Multi-framework applications with different bundling strategies
- Large-scale applications with code splitting and lazy loading
- Server-side rendering performance implications
- Progressive Web App optimization requirements
- Third-party dependency impact on bundle size and runtime performance
- Memory usage patterns and garbage collection optimization
- Network performance and caching strategies
</think>

**Triggers for Extended Analysis:**
- Bundle sizes exceeding 1MB
- Complex webpack configurations
- Multiple build targets (SSR, client, worker)
- Performance-critical applications

I'll analyze your application's bundle composition:

**Bundle Analysis:**
- Total bundle size and individual chunk analysis
- Dependency size breakdown and optimization opportunities
- Code splitting effectiveness and lazy loading patterns
- Asset optimization (images, fonts, CSS)
- Tree shaking effectiveness and dead code elimination

**Webpack Bundle Analyzer Integration:**
- Generate interactive bundle visualization
- Identify largest dependencies and optimization targets
- Analyze duplicate dependencies and consolidation opportunities
- Evaluate chunk splitting strategies

## Phase 3: Runtime Performance Monitoring

I'll measure your application's runtime performance:

**Core Web Vitals Analysis:**
- **Largest Contentful Paint (LCP)**: Loading performance
- **First Input Delay (FID)**: Interactivity measurement
- **Cumulative Layout Shift (CLS)**: Visual stability
- **First Contentful Paint (FCP)**: Initial rendering speed
- **Total Blocking Time (TBT)**: Main thread blocking time

**Performance Metrics Collection:**
- JavaScript execution time and main thread utilization
- Memory usage patterns and potential leaks
- Network request analysis and optimization opportunities
- Rendering performance and paint timing

## Phase 4: Lighthouse Integration

I'll integrate with Lighthouse for comprehensive web performance auditing:

**Lighthouse Audit Categories:**
- **Performance**: Speed and optimization metrics
- **Accessibility**: WCAG compliance and usability
- **Best Practices**: Modern web development standards
- **SEO**: Search engine optimization factors
- **Progressive Web App**: PWA compliance and features

**Automated Recommendations:**
- Specific optimization suggestions with impact estimates
- Code examples for implementing improvements
- Priority ranking based on performance impact
- Before/after comparison capabilities

## Phase 5: Performance Regression Detection

I'll compare current performance against baselines:

**Baseline Management:**
- Store performance metrics for comparison
- Track performance trends over time
- Identify performance regressions automatically
- Generate performance budgets and alerts

**Regression Analysis:**
- Bundle size changes and impact assessment
- Runtime performance degradation detection
- Core Web Vitals trend analysis
- Dependency update impact evaluation

## Context Continuity

**Session Resume:**
When you return and run `/performance-audit` or `/performance-audit resume`:
- Load existing performance analysis and baselines
- Show recent performance changes and trends
- Continue analysis from last checkpoint
- Maintain all performance metrics history

**Progress Example:**
```
RESUMING PERFORMANCE AUDIT SESSION
├── Bundle Size: 1.2MB (↑5% from baseline)
├── LCP: 2.1s (↓0.3s improved)
├── Performance Score: 85/100
└── Recommendations: 8 optimizations identified

Continuing performance analysis...
```

## Practical Examples

**Start Performance Audit:**
```
/performance-audit                    # Complete performance analysis
/performance-audit bundle            # Focus on bundle size analysis
/performance-audit lighthouse        # Run Lighthouse audit
/performance-audit --baseline        # Set new performance baseline
```

**Session Management:**
```
/performance-audit resume     # Continue existing audit
/performance-audit compare    # Compare with baseline
/performance-audit trends     # Show performance trends
```

## Integration with Development Workflow

**Performance Optimization Workflow:**
- Identify performance bottlenecks and optimization opportunities
- Provide specific code changes and configuration updates
- Validate improvements with before/after measurements
- Integrate with CI/CD for continuous performance monitoring

**Command Suggestions:**
Based on findings, I may suggest:
- `/docker-optimize` - For container performance optimization
- `/architecture-analysis` - For structural performance issues
- `/monitoring-setup` - For production performance tracking

## Safety Guarantees

**Protection Measures:**
- Non-destructive analysis with no code modifications
- Baseline preservation for performance comparison
- Comprehensive performance history tracking
- Safe integration with existing build processes

**Important:** I will NEVER:
- Modify build configurations without explicit approval
- Delete existing performance data or baselines
- Make changes that could break production builds
- Add AI attribution to performance reports

## What I'll Actually Do

1. **Analyze comprehensively** - Bundle size, runtime performance, and web vitals
2. **Measure accurately** - Use industry-standard tools and metrics
3. **Compare intelligently** - Track performance trends and regressions
4. **Recommend specifically** - Provide actionable optimization strategies
5. **Monitor continuously** - Maintain performance baselines and alerts
6. **Integrate seamlessly** - Work with existing build and deployment processes

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of performance analysis and optimization progress.