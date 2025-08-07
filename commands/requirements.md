# Requirements Gathering

I'll help you gather and document feature requirements using industry-standard formats, with full continuity across sessions.

Arguments: `$ARGUMENTS` - feature name or requirement focus area

## Session Intelligence

I'll maintain requirements gathering progress across sessions:

**Session Files (in current project directory):**
- `requirements/plan.md` - Requirements document with user stories and acceptance criteria
- `requirements/state.json` - Gathering progress and stakeholder input

**IMPORTANT:** Session files are stored in a `requirements` folder in your current project root

**Auto-Detection:**
- If session exists: Resume requirements refinement
- If no session: Create new requirements document
- Commands: `resume`, `status`, `new`

## Phase 1: Initial Setup & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `requirements` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `requirements/state.json`
   - Look for `requirements/plan.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze project context and patterns
   - Create initial requirements document
   - Initialize progress tracking
4. Show requirements preview before refinement

**Note:** Always look for session files in the current project's `requirements/` folder, not `../../../requirements/` or absolute paths

I'll analyze your project context first:

**Project Analysis:**
- Use **Glob** to understand project structure and technology stack
- Use **Read** to examine existing documentation and patterns
- Use **Grep** to identify current feature patterns and conventions
- Analyze architecture to suggest relevant technical requirements

## Phase 2: Requirements Document Creation

Based on analysis, I'll create a structured requirements document:

**EARS Format Implementation:**
- Easy Approach to Requirements Syntax
- WHEN [event] THEN [system] SHALL [response]
- IF [precondition] THEN [system] SHALL [response]
- Clear, testable acceptance criteria

**Document Structure:**
I'll create `requirements/plan.md` with:

```markdown
# Requirements Document - [Feature Name]

## Introduction
[Clear feature summary and context]

## Requirements

### Requirement 1: [User Story Title]
**User Story:** As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria
1. WHEN [event] THEN [system] SHALL [response]
2. IF [precondition] THEN [system] SHALL [response]
3. WHEN [event] AND [condition] THEN [system] SHALL [response]

### Requirement 2: [User Story Title]
**User Story:** As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria
1. WHEN [event] THEN [system] SHALL [response]
2. WHEN [event] THEN [system] SHALL [response]

## Technical Requirements
- [Technical constraint 1]
- [Technical constraint 2]
- [Integration requirement 1]

## Success Criteria
- [Measurable outcome 1]
- [Measurable outcome 2]
```

## Phase 3: Codebase Pattern Analysis

I'll analyze your existing code to suggest technical requirements:

**Pattern Detection:**
- Authentication patterns for security requirements
- Data validation approaches for input requirements
- Error handling styles for robustness requirements
- Performance patterns for scalability requirements
- Testing approaches for quality requirements

**Technical Requirements Generation:**
- API design consistency requirements
- Database schema requirements
- Security and validation requirements
- Performance and scalability requirements
- Integration and compatibility requirements

## Phase 4: Iterative Refinement

I'll work with you to refine requirements:

**Refinement Process:**
1. Present initial requirements document
2. Gather feedback on completeness and accuracy
3. Identify missing edge cases and scenarios
4. Refine user stories and acceptance criteria
5. Validate technical feasibility
6. Update document with improvements

**Completeness Validation:**
- All user roles covered
- Edge cases identified
- Error scenarios addressed
- Integration points defined
- Success metrics established

## Phase 5: Requirements Validation

Before completion, I'll validate:

**Quality Checks:**
- Each requirement is testable
- Acceptance criteria are measurable
- Technical requirements are feasible
- Requirements are complete and consistent
- Success criteria are achievable

**Integration Readiness:**
- Requirements ready for planning phase
- Technical constraints documented
- Dependencies identified
- Assumptions clearly stated

## Context Continuity

**Session Resume:**
When you return and run `/requirements` or `/requirements resume`:
- Load existing requirements and progress
- Show current status and completeness
- Continue refinement from last point
- Maintain all previous decisions

**Progress Example:**
```
RESUMING REQUIREMENTS SESSION
├── Feature: User Authentication
├── Requirements: 8 of 10 complete
├── Last: Password reset flow
└── Next: Two-factor authentication

Continuing requirements gathering...
```

## Practical Examples

**Start Requirements:**
```
/requirements UserProfile          # Create user profile requirements
/requirements "payment system"     # Create payment requirements
/requirements AuthModule           # Create authentication requirements
```

**Session Control:**
```
/requirements resume    # Continue existing session
/requirements status    # Check progress
/requirements new       # Start fresh requirements
```

## Safety Guarantees

**Protection Measures:**
- Incremental document building
- Session state preservation
- Pattern validation
- Completeness verification

**Important:** I will NEVER:
- Create requirements without analysis
- Skip stakeholder consideration
- Add AI attribution
- Create untestable requirements

## Command Integration

After requirements completion, I may suggest:
- `/plan` - To create implementation plan from requirements
- `/understand` - For deeper codebase analysis if needed

## What I'll Actually Do

1. **Analyze deeply** - Understand your project and context
2. **Document systematically** - Create structured requirements using EARS
3. **Refine iteratively** - Work with you to perfect requirements
4. **Validate thoroughly** - Ensure completeness and testability
5. **Track precisely** - Perfect session continuity

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of requirements decisions.