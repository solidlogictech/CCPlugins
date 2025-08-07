# Visual Regression Testing

I'll set up automated visual regression testing to catch UI changes and ensure consistent visual appearance across your application.

Arguments: `$ARGUMENTS` - component paths, test scenarios, or browser configurations

## Session Intelligence

I'll maintain visual regression testing progress across sessions:

**Session Files (in current project directory):**
- `visual-regression/results.md` - Visual testing results
- `visual-regression/state.json` - Test suite progress and baselines

**IMPORTANT:** Session files are stored in a `visual-regression` folder in your current project root

**Auto-Detection:**
- If session exists: Resume visual testing
- If no session: Create new visual test suite
- Commands: `resume`, `capture`, `compare`

## Phase 1: Visual Testing Strategy Analysis

**MANDATORY FIRST STEPS:**
1. Check if `visual-regression` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `visual-regression/state.json`
   - Look for `visual-regression/results.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze UI components and page structures
   - Identify visual testing requirements and scenarios
   - Create comprehensive visual testing plan
4. Show visual testing setup preview before implementation

**UI Component Analysis:**
- Use **Glob** to find component files and page templates
- Use **Read** to analyze component structure and styling
- Use **Grep** to identify dynamic content and interactive elements
- Analyze existing test infrastructure and browser automation

## Phase 2: Screenshot Capture System

### Extended Thinking for Complex Visual Testing

For complex visual testing scenarios, I'll use extended thinking:

<think>
When implementing comprehensive visual regression testing:
- Multi-browser and cross-platform visual consistency validation
- Responsive design testing across different viewport sizes and devices
- Dynamic content handling and data-driven visual testing scenarios
- Component-level visual testing with isolated rendering environments
- Animation and transition testing with timing considerations
- Accessibility visual testing including focus states and color contrast
- Performance implications of visual testing in CI/CD pipelines
</think>

**Triggers for Extended Analysis:**
- Complex responsive designs with multiple breakpoints
- Dynamic content with user-generated or API-driven data
- Animation-heavy interfaces requiring timing coordination
- Multi-theme or white-label applications

I'll implement automated screenshot capture:

**Browser Automation:**
- **Playwright**: Modern browser automation with multiple browser support
- **Puppeteer**: Chrome/Chromium automation for visual testing
- **Selenium**: Cross-browser testing with WebDriver integration
- **Cypress**: End-to-end testing with visual regression capabilities

**Capture Configuration:**
- Multiple viewport sizes and device emulation
- Cross-browser screenshot consistency
- Element-specific screenshot capture
- Full-page and component-level visual testing

## Phase 3: Visual Difference Detection

I'll implement intelligent visual comparison:

**Difference Detection Algorithms:**
- Pixel-perfect comparison for exact visual matching
- Perceptual difference detection for human-visible changes
- Layout shift detection and structural change analysis
- Color and contrast difference identification

**Comparison Features:**
- Baseline image management and version control
- Threshold configuration for acceptable visual differences
- Ignore regions for dynamic content and timestamps
- Batch comparison and reporting for multiple test scenarios

## Phase 4: Responsive Design Validation

I'll test visual consistency across devices:

**Multi-Viewport Testing:**
- Desktop, tablet, and mobile viewport validation
- Custom breakpoint testing for responsive designs
- Orientation change testing (portrait/landscape)
- High-DPI and retina display compatibility

**Device Emulation:**
- Popular device preset configurations
- Custom device specifications and testing scenarios
- Touch interaction and hover state validation
- Performance impact assessment across devices

## Phase 5: Component-Level Visual Testing

I'll implement isolated component testing:

**Component Isolation:**
- Storybook integration for component visual testing
- Isolated rendering environments for consistent testing
- Props and state variation testing
- Component interaction and state change validation

**Test Scenario Generation:**
- Automatic test case generation from component props
- Edge case and error state visual validation
- Accessibility state testing (focus, hover, disabled)
- Theme and styling variation testing

## Phase 6: CI/CD Integration

I'll integrate visual testing into development workflows:

**Continuous Integration:**
- Automated visual regression testing in CI pipelines
- Pull request visual diff reporting and approval workflows
- Baseline update automation and management
- Performance optimization for CI execution

**Workflow Integration:**
- Git integration for baseline management and versioning
- Review and approval workflows for visual changes
- Automated baseline updates for approved changes
- Notification and reporting for visual regressions

## Context Continuity

**Session Resume:**
When you return and run `/visual-regression` or `/visual-regression resume`:
- Load existing visual test configuration and results
- Show recent visual changes and test status
- Continue testing from last checkpoint
- Maintain all baseline images and test configurations

**Progress Example:**
```
RESUMING VISUAL REGRESSION SESSION
├── Components Tested: 45/52 (87%)
├── Baseline Images: 156 captured
├── Visual Differences: 3 detected
└── Browser Coverage: Chrome, Firefox, Safari

Continuing visual regression testing...
```

## Practical Examples

**Start Visual Regression Testing:**
```
/visual-regression                   # Complete visual test setup
/visual-regression components/       # Test specific component directory
/visual-regression --capture         # Capture new baseline images
/visual-regression --compare         # Compare against baselines
```

**Session Management:**
```
/visual-regression resume    # Continue existing testing
/visual-regression capture   # Capture baseline images
/visual-regression compare   # Run visual comparison
```

## Integration with Development Workflow

**Visual Testing Workflow:**
- Integrate with component development and design systems
- Generate visual test cases from design specifications
- Validate visual consistency during code reviews
- Monitor visual quality and design system compliance

**Command Suggestions:**
Based on testing needs, I may suggest:
- `/accessibility-scan` - For visual accessibility testing
- `/performance-audit` - For visual performance optimization
- `/expand-components` - For component test coverage

## Safety Guarantees

**Protection Measures:**
- Non-destructive visual testing with baseline preservation
- Secure baseline image storage and version control
- Comprehensive test result documentation and history
- Safe integration with existing testing infrastructure

**Important:** I will NEVER:
- Automatically approve visual changes without review
- Delete baseline images without proper backup
- Modify production applications during testing
- Add AI attribution to visual test configurations

## What I'll Actually Do

1. **Analyze comprehensively** - UI components and visual testing requirements
2. **Capture systematically** - Baseline images across browsers and devices
3. **Compare intelligently** - Visual differences with configurable thresholds
4. **Test responsively** - Multi-device and viewport validation
5. **Integrate seamlessly** - CI/CD and development workflow integration
6. **Report clearly** - Visual regression results and approval workflows

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of visual testing setup and results.