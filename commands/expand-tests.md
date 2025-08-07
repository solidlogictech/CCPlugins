# Expand Test Coverage

I'll analyze existing tests and expand coverage by creating additional tests following your established patterns, with intelligent gap identification and framework integration.

Arguments: `$ARGUMENTS` - module name, file path, or test focus area

## Session Intelligence

I'll maintain test expansion progress across sessions:

**Session Files (in current project directory):**
- `expand-tests/analysis.md` - Test coverage analysis and expansion plan
- `expand-tests/state.json` - Coverage expansion progress and generated tests

**IMPORTANT:** Session files are stored in an `expand-tests` folder in your current project root

**Auto-Detection:**
- If session exists: Resume test expansion
- If no session: Create new test analysis
- Commands: `resume`, `coverage`, `patterns`

## Phase 1: Existing Test Pattern Analysis

**MANDATORY FIRST STEPS:**
1. Check if `expand-tests` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `expand-tests/state.json`
   - Look for `expand-tests/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze existing test patterns and structure
   - Identify testing frameworks and conventions
   - Create test expansion plan
4. Show test analysis summary before expansion

**Test Pattern Discovery:**
- Use **Glob** to find all test files and directories
- Use **Read** to analyze existing test structure and patterns
- Use **Grep** to identify testing frameworks, assertion styles, and conventions
- Analyze test naming patterns, organization, and coverage approaches

## Phase 2: Testing Framework & Style Detection

I'll identify your testing approach and conventions:

**Framework Detection:**
- Testing frameworks (Jest, Mocha, Pytest, JUnit, etc.)
- Assertion libraries and styles
- Mocking and stubbing approaches
- Test runner configuration and setup

**Pattern Analysis:**
- Test file naming conventions
- Test organization and grouping patterns
- Setup and teardown patterns
- Mock and fixture usage patterns
- Assertion styles and error message formats

## Phase 3: Coverage Gap Identification

I'll identify untested code paths and scenarios:

**Gap Analysis:**
- Use **Grep** to find functions, methods, and classes without tests
- Identify edge cases and error scenarios not covered
- Find integration points lacking test coverage
- Discover performance and security test gaps

**Test Expansion Planning:**
I'll create `expand-tests/analysis.md` with:

```markdown
# Test Coverage Expansion Analysis

## Current Test Status
- **Test Framework**: Jest with React Testing Library
- **Total Test Files**: 45 files
- **Coverage**: 73% lines, 68% branches, 82% functions
- **Test Patterns**: Describe/it structure, beforeEach setup

## Existing Test Patterns

### Naming Conventions
- Test files: `*.test.js` in same directory as source
- Test descriptions: "should [expected behavior] when [condition]"
- Mock files: `__mocks__/[module-name].js`

### Common Patterns
```javascript
describe('UserService', () => {
  let userService;
  
  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });
  
  it('should authenticate user when valid credentials provided', async () => {
    // Arrange
    const credentials = { username: 'test', password: 'pass' };
    mockAuthAPI.authenticate.mockResolvedValue({ token: 'abc123' });
    
    // Act
    const result = await userService.authenticate(credentials);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.token).toBe('abc123');
  });
});
```

### Assertion Styles
- Boolean assertions: `expect(result).toBe(true)`
- Object matching: `expect(result).toMatchObject({ success: true })`
- Array assertions: `expect(items).toHaveLength(3)`
- Mock verification: `expect(mockFn).toHaveBeenCalledWith(expectedArgs)`

## Coverage Gaps Identified

### Untested Functions
1. **UserService.resetPassword()** - No tests found
   - **Location**: src/services/UserService.js:145
   - **Complexity**: Medium (error handling, email validation)
   - **Priority**: High (security-related)

2. **PaymentProcessor.refundPayment()** - No tests found
   - **Location**: src/services/PaymentProcessor.js:89
   - **Complexity**: High (external API, state management)
   - **Priority**: Critical (financial operations)

### Missing Edge Cases
1. **UserService.authenticate()** - Missing error scenarios
   - **Existing**: Happy path, invalid credentials
   - **Missing**: Network errors, malformed responses, rate limiting
   - **Priority**: High

2. **DataValidator.validateEmail()** - Missing boundary cases
   - **Existing**: Valid emails, obviously invalid emails
   - **Missing**: Edge case formats, internationalization, length limits
   - **Priority**: Medium

### Integration Test Gaps
1. **Authentication Flow** - End-to-end testing missing
   - **Components**: Login form → UserService → API → State update
   - **Missing**: Complete user journey testing
   - **Priority**: High

2. **Payment Processing** - Integration with external services
   - **Components**: Payment form → Validation → External API → Confirmation
   - **Missing**: External service integration testing
   - **Priority**: Critical

## Test Expansion Plan

### Phase 1: Critical Gaps (High Priority)
- [ ] Add comprehensive tests for UserService.resetPassword()
- [ ] Create full test suite for PaymentProcessor.refundPayment()
- [ ] Add error scenario tests for authentication flow
- [ ] Create integration tests for payment processing

### Phase 2: Important Gaps (Medium Priority)
- [ ] Expand edge case testing for data validation
- [ ] Add performance tests for data processing functions
- [ ] Create accessibility tests for UI components
- [ ] Add security tests for input handling

### Phase 3: Enhancement (Low Priority)
- [ ] Add property-based testing for complex algorithms
- [ ] Create visual regression tests for UI components
- [ ] Add load testing for API endpoints
- [ ] Create mutation testing for test quality validation

## Generated Test Examples

### UserService.resetPassword() Tests
```javascript
describe('UserService.resetPassword', () => {
  it('should send reset email when valid email provided', async () => {
    // Following existing pattern...
  });
  
  it('should throw error when invalid email provided', async () => {
    // Following existing error handling pattern...
  });
  
  it('should handle network errors gracefully', async () => {
    // Following existing error handling pattern...
  });
});
```

## Coverage Improvement Metrics
- **Target Coverage**: 85% lines, 80% branches, 90% functions
- **Estimated New Tests**: 23 test cases
- **Estimated Effort**: 12-15 hours
- **Risk Reduction**: High (covers critical security and financial functions)
```

## Phase 4: Test Generation Following Patterns

I'll generate new tests matching your established patterns:

**Pattern Matching:**
- Follow existing test file naming and organization
- Use same testing framework and assertion styles
- Match setup/teardown patterns and mock usage
- Maintain consistent test description formats

**Test Creation:**
- Generate tests for untested functions and methods
- Create edge case and error scenario tests
- Add integration tests for component interactions
- Include performance and security tests where appropriate

## Phase 5: Integration with Build Process

I'll ensure new tests integrate with existing build processes:

**Build Integration:**
- Verify tests run with existing test commands
- Ensure coverage reporting includes new tests
- Check CI/CD pipeline compatibility
- Validate test performance and execution time

**Quality Assurance:**
- Run new tests to ensure they pass
- Verify tests actually test the intended functionality
- Check for test isolation and independence
- Validate mock usage and test data management

## Context Continuity

**Session Resume:**
When you return and run `/expand-tests` or `/expand-tests resume`:
- Load existing test analysis and expansion progress
- Show coverage improvements and remaining gaps
- Continue test generation from last point
- Maintain all pattern analysis and decisions

**Progress Example:**
```
RESUMING TEST EXPANSION SESSION
├── Module: UserService
├── Tests Generated: 8 of 12 planned
├── Coverage Improved: 73% → 81%
└── Next: PaymentProcessor error scenarios

Continuing test coverage expansion...
```

## Practical Examples

**Expand Tests:**
```
/expand-tests UserService        # Expand tests for specific module
/expand-tests src/components/    # Expand tests for directory
/expand-tests "authentication"   # Focus on authentication-related tests
```

**Analysis Commands:**
```
/expand-tests coverage    # Show coverage analysis
/expand-tests patterns    # Analyze existing test patterns
/expand-tests gaps        # Focus on coverage gaps
```

## Integration with Testing Workflow

**Testing Strategy:**
- Identify critical paths needing test coverage
- Prioritize security and business-critical functions
- Balance unit, integration, and end-to-end testing
- Maintain test performance and execution speed

**Quality Metrics:**
- Track coverage improvements over time
- Monitor test execution performance
- Measure defect detection effectiveness
- Assess test maintenance overhead

## Safety Guarantees

**Protection Measures:**
- Generate tests that follow existing patterns exactly
- Ensure new tests don't break existing test suite
- Validate test isolation and independence
- Maintain test performance standards

**Important:** I will NEVER:
- Modify existing tests without explicit request
- Generate tests that don't follow project patterns
- Create tests that break build processes
- Add AI attribution to test files

## Command Integration

After test expansion, I may suggest:
- `/test` - To run expanded test suite
- `/review` - To validate test quality
- `/commit` - To save test improvements
- `/format` - To ensure test code formatting

## What I'll Actually Do

1. **Analyze patterns** - Understand existing test structure and conventions
2. **Identify gaps** - Find untested code and missing scenarios
3. **Generate systematically** - Create tests following established patterns
4. **Integrate seamlessly** - Ensure compatibility with build processes
5. **Improve coverage** - Focus on critical and high-risk areas
6. **Track progress** - Monitor coverage improvements and test quality

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of test analysis and expansion progress.