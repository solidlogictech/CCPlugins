# Accessibility Scan

I'll analyze your web application for accessibility compliance and provide automated remediation suggestions following WCAG 2.1 AA/AAA standards.

Arguments: `$ARGUMENTS` - specific accessibility focus areas or compliance level

## Session Intelligence

I'll maintain accessibility scan progress across sessions:

**Session Files (in current project directory):**
- `accessibility-scan/report.md` - Accessibility audit results and remediation plan
- `accessibility-scan/state.json` - Scan progress and violation tracking

**IMPORTANT:** Session files are stored in an `accessibility-scan` folder in your current project root

**Auto-Detection:**
- If session exists: Resume accessibility analysis
- If no session: Create new accessibility audit
- Commands: `resume`, `fix`, `validate`

## Phase 1: Initial Setup & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `accessibility-scan` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `accessibility-scan/state.json`
   - Look for `accessibility-scan/report.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze project structure and UI framework
   - Create accessibility audit plan
   - Initialize violation tracking
4. Show accessibility analysis preview before execution

**Accessibility Context Analysis:**
- Use **Glob** to find UI component files and templates
- Use **Read** to analyze HTML structure and component patterns
- Use **Grep** to identify accessibility attributes and patterns
- Analyze framework-specific accessibility implementations

## Phase 2: WCAG Compliance Analysis

### Extended Thinking for Complex Accessibility Scenarios

For complex accessibility scenarios, I'll use extended thinking:

<think>
When analyzing complex accessibility requirements:
- Multi-modal interfaces with voice, touch, and keyboard navigation
- Dynamic content and single-page application accessibility
- Complex form validation and error handling patterns
- Screen reader compatibility across different assistive technologies
- Color accessibility for users with various types of color vision deficiency
- Cognitive accessibility considerations for users with learning disabilities
- Internationalization accessibility for right-to-left languages and cultural considerations
</think>

**Triggers for Extended Analysis:**
- Complex interactive components (modals, dropdowns, carousels)
- Dynamic content updates and live regions
- Custom form controls and validation
- Data visualization and charts
- Multi-step processes and wizards

I'll analyze your application against WCAG 2.1 standards:

**WCAG 2.1 AA Compliance:**
- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

**Automated Testing Integration:**
- **axe-core**: Industry-standard accessibility testing engine
- **Lighthouse accessibility audit**: Google's accessibility analysis
- **Custom rule sets**: Framework-specific accessibility patterns
- **Manual testing guidance**: Areas requiring human verification

## Phase 3: Violation Detection and Categorization

I'll identify and categorize accessibility violations:

**Violation Categories:**
- **Critical**: Blocks access for users with disabilities
- **Serious**: Major barriers that significantly impact usability
- **Moderate**: Noticeable issues that affect user experience
- **Minor**: Best practice violations with minimal impact

**Common Violation Types:**
- **Color Contrast**: Insufficient contrast ratios for text and backgrounds
- **Keyboard Navigation**: Missing or broken keyboard accessibility
- **Screen Reader**: Missing or incorrect ARIA labels and descriptions
- **Form Accessibility**: Unlabeled inputs and poor error handling
- **Image Accessibility**: Missing alt text and decorative image handling
- **Focus Management**: Poor focus indicators and focus trapping

## Phase 4: Automated Remediation

I'll provide automated fixes for common accessibility issues:

**Automatic Fixes:**
- Add missing alt attributes to images
- Generate ARIA labels for unlabeled elements
- Fix color contrast issues with compliant alternatives
- Add keyboard event handlers where missing
- Implement proper heading hierarchy
- Add skip links for navigation

**Semi-Automatic Fixes:**
- Suggest ARIA label text for complex components
- Recommend color palette adjustments
- Provide keyboard navigation implementation patterns
- Generate form validation error handling code

## Phase 5: Manual Testing Guidance

I'll provide guidance for manual accessibility testing:

**Manual Testing Areas:**
- **Keyboard Navigation**: Tab order and keyboard-only operation
- **Screen Reader Testing**: Content reading order and announcements
- **Color Vision Testing**: Interface usability without color
- **Zoom Testing**: 200% zoom usability and responsive design
- **Cognitive Load**: Clear language and simple navigation patterns

**Testing Tools Integration:**
- Screen reader testing with NVDA, JAWS, VoiceOver
- Keyboard navigation testing procedures
- Color vision simulation tools
- Zoom and magnification testing

## Context Continuity

**Session Resume:**
When you return and run `/accessibility-scan` or `/accessibility-scan resume`:
- Load existing accessibility analysis and violations
- Show remediation progress and remaining issues
- Continue scan from last checkpoint
- Maintain all violation tracking and fixes

**Progress Example:**
```
RESUMING ACCESSIBILITY SCAN SESSION
├── Violations Found: 23 (↓5 from last scan)
├── Critical: 2 remaining
├── Auto-fixes Applied: 8
└── Manual Review Needed: 6 items

Continuing accessibility analysis...
```

## Practical Examples

**Start Accessibility Scan:**
```
/accessibility-scan                    # Complete accessibility audit
/accessibility-scan --level=AAA       # WCAG AAA compliance check
/accessibility-scan --fix             # Auto-fix common issues
/accessibility-scan components/        # Scan specific directory
```

**Session Management:**
```
/accessibility-scan resume     # Continue existing scan
/accessibility-scan validate   # Validate previous fixes
/accessibility-scan report     # Generate compliance report
```

## Integration with Development Workflow

**Accessibility-First Development:**
- Integrate with component development workflow
- Provide accessibility guidelines for new components
- Validate accessibility during code review process
- Generate accessibility documentation and guidelines

**Command Suggestions:**
Based on findings, I may suggest:
- `/visual-regression` - For testing accessibility fixes visually
- `/expand-components` - For creating accessible component variants
- `/monitoring-setup` - For tracking accessibility metrics in production

## Safety Guarantees

**Protection Measures:**
- Non-destructive analysis with optional automated fixes
- Backup creation before applying any code changes
- Comprehensive violation tracking and remediation history
- Safe integration with existing component libraries

**Important:** I will NEVER:
- Modify code without explicit permission for auto-fixes
- Remove existing accessibility features without replacement
- Make changes that could break existing functionality
- Add AI attribution to accessibility improvements

## What I'll Actually Do

1. **Scan comprehensively** - Analyze all UI components and templates
2. **Test systematically** - Use multiple accessibility testing tools
3. **Categorize intelligently** - Prioritize violations by impact and severity
4. **Fix automatically** - Apply safe automated remediation where possible
5. **Guide manually** - Provide clear instructions for complex fixes
6. **Track continuously** - Monitor accessibility improvements over time

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of accessibility analysis and remediation progress.