# Feature Planning

I'll transform your requirements into detailed implementation plans with tasks, dependencies, and risk assessment, maintaining full continuity across sessions.

Arguments: `$ARGUMENTS` - feature name or planning focus area

## Session Intelligence

I'll maintain planning progress across sessions:

**Session Files (in current project directory):**
- `plan/plan.md` - Implementation roadmap with tasks and dependencies
- `plan/state.json` - Planning progress and architectural decisions

**IMPORTANT:** Session files are stored in a `plan` folder in your current project root

**Auto-Detection:**
- If session exists: Resume planning refinement
- If no session: Create new implementation plan
- Commands: `resume`, `status`, `new`

## Phase 1: Requirements Loading & Validation

**MANDATORY FIRST STEPS:**
1. Check if `plan` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `plan/state.json`
   - Look for `plan/plan.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Load requirements from `requirements/plan.md`
   - Validate requirements completeness
   - Create new planning session
4. Show planning preview before execution

**Requirements Validation:**
- Verify requirements document exists
- Check all user stories have acceptance criteria
- Ensure technical requirements are defined
- Validate requirements are complete and testable

**Note:** If no requirements exist, I'll suggest running `/requirements` first

## Phase 2: Architecture Analysis

### Extended Thinking for Complex Planning

For complex implementation scenarios, I'll use extended thinking to develop comprehensive strategies:

<think>
When faced with complex feature planning:
- Multi-step implementation paths that minimize risk
- Dependency analysis and critical path optimization
- Integration complexity assessment and mitigation strategies
- Performance implications of different architectural approaches
- Scalability considerations and future-proofing decisions
- Team capacity and skill set alignment with technical choices
- Testing strategies that validate each implementation phase
- Rollback and recovery plans for high-risk implementations
</think>

**Triggers for Extended Analysis:**
- Large-scale architectural changes
- Complex integration requirements
- Performance-critical implementations
- Security-sensitive features
- Multi-team coordination needs

I'll analyze your project architecture to suggest implementation approaches:

**Architecture Discovery:**
- Use **Glob** to map project structure and patterns
- Use **Read** to understand existing architectural decisions
- Use **Grep** to identify current implementation patterns
- Analyze technology stack and framework conventions

**Implementation Approach Analysis:**
- Identify existing patterns to follow
- Determine integration points and dependencies
- Assess architectural constraints and opportunities
- Evaluate technology choices and frameworks

## Phase 3: Task Breakdown & Planning

Based on requirements and architecture, I'll create detailed implementation plan:

**Plan Structure:**
I'll create `plan/plan.md` with:

```markdown
# Implementation Plan - [Feature Name]

## Requirements Reference
- **Source**: requirements/plan.md
- **Requirements Count**: [X user stories, Y technical requirements]
- **Validation Status**: Complete

## Architecture Analysis
- **Current Architecture**: [Description of existing patterns]
- **Integration Points**: [Where new feature connects]
- **Technology Stack**: [Relevant technologies and frameworks]
- **Constraints**: [Technical limitations and considerations]

## Implementation Tasks

### Phase 1: Foundation
- [ ] 1.1 Set up core data models
  - Create [Model] class with validation
  - Implement database schema changes
  - Write unit tests for model validation
  - **Effort**: 4-6 hours | **Risk**: Low
  - **Dependencies**: None
  - **Requirements**: [Req 1.1, 1.2]

- [ ] 1.2 Create service layer
  - Implement [Service] class with business logic
  - Add error handling and validation
  - Write comprehensive unit tests
  - **Effort**: 6-8 hours | **Risk**: Medium
  - **Dependencies**: 1.1
  - **Requirements**: [Req 2.1, 2.3]

### Phase 2: API Layer
- [ ] 2.1 Implement API endpoints
  - Create REST endpoints following project patterns
  - Add request/response validation
  - Implement authentication/authorization
  - **Effort**: 8-10 hours | **Risk**: Medium
  - **Dependencies**: 1.1, 1.2
  - **Requirements**: [Req 3.1, 3.2, 3.3]

### Phase 3: Integration & Testing
- [ ] 3.1 Integration testing
  - Write end-to-end tests
  - Test error scenarios and edge cases
  - Performance testing if required
  - **Effort**: 4-6 hours | **Risk**: Low
  - **Dependencies**: All previous tasks
  - **Requirements**: [All requirements]

## Risk Assessment
- **High Risk**: [Items that could cause significant delays]
- **Medium Risk**: [Items with some uncertainty]
- **Low Risk**: [Straightforward implementations]

## Critical Path
1. Foundation tasks (1.1, 1.2) - 10-14 hours
2. API implementation (2.1) - 8-10 hours
3. Integration testing (3.1) - 4-6 hours
**Total Estimated Effort**: 22-30 hours

## Integration Suggestions
- Use `/scaffold` for initial file structure
- Use `/implement` for complex feature implementation
- Use `/test` after each phase completion
```

## Phase 4: Dependency Mapping & Critical Path

I'll analyze task dependencies and create critical path:

**Dependency Analysis:**
- Identify prerequisite tasks
- Map inter-task dependencies
- Calculate critical path timing
- Identify parallel work opportunities

**Risk Identification:**
- Technical complexity assessment
- Integration complexity evaluation
- External dependency risks
- Timeline and resource constraints

## Phase 5: Integration Planning

I'll suggest integration with existing CCPlugins commands:

**Command Integration:**
- `/scaffold` for initial project structure
- `/implement` for complex feature development
- `/test` for validation after each phase
- `/review` for code quality assurance
- `/security-scan` for security validation

**Workflow Suggestions:**
- Logical progression through implementation phases
- Testing checkpoints and validation gates
- Code review and quality assurance points
- Documentation and deployment preparation

## Context Continuity

**Session Resume:**
When you return and run `/plan` or `/plan resume`:
- Load existing plan and progress
- Show task completion status
- Continue planning from last point
- Maintain all architectural decisions

**Progress Example:**
```
RESUMING PLANNING SESSION
├── Feature: User Authentication
├── Tasks: 12 of 15 planned
├── Current Phase: API Layer
└── Next: Integration testing planning

Continuing implementation planning...
```

## Practical Examples

**Start Planning:**
```
/plan UserProfile          # Plan user profile implementation
/plan "payment system"     # Plan payment system implementation
/plan AuthModule           # Plan authentication module
```

**Session Control:**
```
/plan resume    # Continue existing planning session
/plan status    # Check planning progress
/plan new       # Start fresh planning (archives existing)
```

## Safety Guarantees

**Protection Measures:**
- Requirements validation before planning
- Incremental plan building
- Risk assessment and mitigation
- Integration point validation

**Important:** I will NEVER:
- Plan without validated requirements
- Create unrealistic timelines
- Skip risk assessment
- Add AI attribution

## Command Integration

After planning completion, I may suggest:
- `/scaffold` - To create initial project structure
- `/implement` - To begin feature implementation
- `/validate-implementation` - To track implementation progress

## What I'll Actually Do

1. **Validate requirements** - Ensure complete requirements exist
2. **Analyze architecture** - Understand integration context
3. **Break down systematically** - Create manageable tasks
4. **Assess risks** - Identify potential challenges
5. **Plan integration** - Connect with existing workflows
6. **Track precisely** - Perfect session continuity

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of planning decisions and architectural analysis.