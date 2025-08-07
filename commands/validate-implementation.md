# Implementation Validation

I'll ensure your implementation matches original requirements and plans, providing comprehensive gap analysis and remediation guidance with full session continuity.

Arguments: `$ARGUMENTS` - feature name or validation focus area

## Session Intelligence

I'll maintain validation progress across sessions:

**Session Files (in current project directory):**
- `validate-implementation/plan.md` - Validation checklist and gap analysis
- `validate-implementation/state.json` - Validation progress and findings

**IMPORTANT:** Session files are stored in a `validate-implementation` folder in your current project root

**Auto-Detection:**
- If session exists: Resume validation analysis
- If no session: Create new validation assessment
- Commands: `resume`, `status`, `new`

## Phase 1: Requirements & Plan Loading

**MANDATORY FIRST STEPS:**
1. Check if `validate-implementation` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `validate-implementation/state.json`
   - Look for `validate-implementation/plan.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Load requirements from `requirements/plan.md`
   - Load implementation plan from `plan/plan.md`
   - Create validation assessment
4. Show validation summary before analysis

**Prerequisites Validation:**
- Verify requirements document exists and is complete
- Check implementation plan exists with defined tasks
- Ensure current implementation is available for analysis
- Validate all necessary context is available

**Note:** If requirements or plan missing, I'll suggest running `/requirements` and `/plan` first

## Phase 2: Requirements Traceability Analysis

### Extended Thinking for Complex Validation

For complex validation scenarios, I'll use extended thinking to ensure comprehensive analysis:

<think>
When validating complex implementations:
- Hidden dependencies and integration points that might be missed
- Edge cases and error scenarios that weren't explicitly tested
- Performance implications that may not be immediately obvious
- Security vulnerabilities that could emerge from feature interactions
- Scalability bottlenecks that appear under load
- User experience implications of technical implementation choices
- Maintenance and debugging complexity introduced by the implementation
- Backwards compatibility and migration considerations
</think>

**Triggers for Extended Analysis:**
- Security-critical features
- Performance-sensitive implementations
- Complex integration scenarios
- Multi-user or multi-tenant features
- Financial or data-sensitive operations

I'll create a comprehensive traceability matrix:

**Traceability Mapping:**
- Map each requirement to implementation code
- Verify acceptance criteria are met
- Check technical requirements compliance
- Validate success criteria achievement

**Analysis Process:**
- Use **Grep** to find implementation code for each requirement
- Use **Read** to analyze code completeness and correctness
- Use **Glob** to ensure all planned files exist
- Cross-reference plan tasks with actual implementation

## Phase 3: Acceptance Criteria Verification

I'll verify each acceptance criterion systematically:

**Verification Process:**
For each requirement's acceptance criteria:
1. Locate implementing code
2. Analyze behavior against EARS format criteria
3. Test edge cases and error scenarios
4. Verify integration points work correctly
5. Check performance and security requirements

**Gap Identification:**
- Missing implementations
- Incomplete implementations
- Deviations from requirements
- Integration failures
- Performance issues

## Phase 4: Comprehensive Gap Analysis

Based on analysis, I'll create detailed gap report:

**Validation Report Structure:**
I'll create `validate-implementation/plan.md` with:

```markdown
# Implementation Validation Report - [Feature Name]

## Validation Summary
- **Requirements Analyzed**: [X of Y requirements]
- **Acceptance Criteria**: [X of Y criteria met]
- **Overall Coverage**: [X%]
- **Validation Status**: [Complete/Incomplete/Failed]

## Requirements Traceability Matrix

### Requirement 1: [Title]
- **Status**: ✅ Complete / ⚠️ Partial / ❌ Missing
- **Implementation**: [File paths and line numbers]
- **Acceptance Criteria**:
  - ✅ WHEN user logs in THEN system SHALL authenticate
  - ⚠️ WHEN invalid credentials THEN system SHALL show error (partial)
  - ❌ WHEN account locked THEN system SHALL notify admin (missing)

### Requirement 2: [Title]
- **Status**: ✅ Complete / ⚠️ Partial / ❌ Missing
- **Implementation**: [File paths and line numbers]
- **Acceptance Criteria**:
  - ✅ All criteria met

## Gap Analysis

### Critical Gaps (Must Fix)
1. **Missing Feature**: Account lockout notification
   - **Requirement**: Req 1.3
   - **Impact**: Security vulnerability
   - **Location**: auth/service.js:45
   - **Remediation**: Add admin notification on account lock
   - **Effort**: 2-3 hours

### Important Gaps (Should Fix)
2. **Incomplete Implementation**: Error message display
   - **Requirement**: Req 1.2
   - **Impact**: Poor user experience
   - **Location**: auth/controller.js:78
   - **Remediation**: Enhance error message handling
   - **Effort**: 1-2 hours

### Minor Gaps (Could Fix)
3. **Enhancement Opportunity**: Logging improvement
   - **Requirement**: Non-functional requirement
   - **Impact**: Debugging difficulty
   - **Location**: Multiple files
   - **Remediation**: Add structured logging
   - **Effort**: 3-4 hours

## Implementation Quality Assessment
- **Code Quality**: [Assessment of maintainability]
- **Test Coverage**: [X% coverage, gaps identified]
- **Performance**: [Performance requirements met/not met]
- **Security**: [Security requirements compliance]
- **Documentation**: [Documentation completeness]

## Remediation Plan
1. **Phase 1**: Fix critical gaps (Priority: High)
2. **Phase 2**: Address important gaps (Priority: Medium)
3. **Phase 3**: Implement enhancements (Priority: Low)

## Next Steps
- [ ] Fix critical security gap in account lockout
- [ ] Enhance error message handling
- [ ] Add comprehensive test coverage
- [ ] Update documentation
```

## Phase 5: Actionable Remediation

I'll provide specific remediation guidance:

**Remediation Categories:**
- **Critical**: Security issues, broken functionality
- **Important**: User experience issues, incomplete features
- **Minor**: Code quality improvements, enhancements

**Specific Guidance:**
- Exact file locations and line numbers
- Code examples following project patterns
- Integration points to consider
- Testing requirements for fixes

## Integration with Existing Commands

I'll suggest relevant CCPlugins commands for remediation:

**Command Suggestions:**
- `/review` - For code quality issues
- `/security-scan` - For security gaps
- `/test` - For test coverage improvements
- `/implement` - For missing feature implementation
- `/refactor` - For code quality improvements

## Context Continuity

**Session Resume:**
When you return and run `/validate-implementation` or `/validate-implementation resume`:
- Load existing validation results
- Show gap remediation progress
- Continue validation from last point
- Maintain all analysis decisions

**Progress Example:**
```
RESUMING VALIDATION SESSION
├── Feature: User Authentication
├── Requirements: 8 of 10 validated
├── Gaps Found: 5 (2 critical, 2 important, 1 minor)
├── Fixed: 2 gaps resolved
└── Next: Validate password reset flow

Continuing implementation validation...
```

## Practical Examples

**Start Validation:**
```
/validate-implementation UserProfile     # Validate user profile implementation
/validate-implementation "auth system"   # Validate authentication system
/validate-implementation PaymentModule   # Validate payment module
```

**Session Control:**
```
/validate-implementation resume    # Continue existing validation
/validate-implementation status    # Check validation progress
/validate-implementation new       # Start fresh validation
```

## Safety Guarantees

**Protection Measures:**
- Non-destructive analysis only
- Comprehensive gap documentation
- Actionable remediation guidance
- Integration point validation

**Important:** I will NEVER:
- Modify code during validation
- Skip critical gap identification
- Provide vague remediation advice
- Add AI attribution

## Command Integration

After validation completion, I may suggest:
- `/implement` - To fix identified gaps
- `/test` - To improve test coverage
- `/review` - For code quality improvements
- `/security-scan` - For security issue resolution

## What I'll Actually Do

1. **Load completely** - Requirements, plans, and implementation
2. **Trace systematically** - Map requirements to implementation
3. **Analyze thoroughly** - Check acceptance criteria compliance
4. **Identify precisely** - Find all gaps and deviations
5. **Guide specifically** - Provide actionable remediation
6. **Track continuously** - Perfect session continuity

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of validation findings and remediation progress.