# Feature Lifecycle Status

I'll track the complete lifecycle of features from requirements to deployment, providing visibility into project progress and identifying bottlenecks with full session continuity.

Arguments: `$ARGUMENTS` - feature name or status focus area

## Session Intelligence

I'll maintain feature status tracking across sessions:

**Session Files (in current project directory):**
- `feature-status/dashboard.md` - Project-wide status overview
- `feature-status/state.json` - Feature tracking and phase management

**IMPORTANT:** Session files are stored in a `feature-status` folder in your current project root

**Auto-Detection:**
- If session exists: Resume status tracking
- If no session: Create new status dashboard
- Commands: `resume`, `dashboard`, `summary`

## Phase 1: Feature Discovery & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `feature-status` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `feature-status/state.json`
   - Look for `feature-status/dashboard.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Scan for all feature lifecycle artifacts
   - Create comprehensive status dashboard
   - Initialize progress tracking
4. Show status summary before detailed analysis

**Feature Lifecycle Scanning:**
- Use **Glob** to find requirements/, plan/, validate-implementation/, adr/ folders
- Use **Read** to analyze feature progress in each phase
- Use **Grep** to identify feature references in code and documentation
- Scan for implementation artifacts and completion status

## Phase 2: Multi-Phase Status Tracking

I'll track features across all lifecycle phases:

**Lifecycle Phases:**
1. **Requirements** - Requirements gathering and documentation
2. **Planning** - Implementation planning and task breakdown
3. **Implementation** - Active development and coding
4. **Validation** - Implementation validation against requirements
5. **Deployment** - Deployment readiness and release preparation

**Status Dashboard Creation:**
I'll create `feature-status/dashboard.md` with:

```markdown
# Feature Status Dashboard

## Project Overview
- **Total Features**: [X features tracked]
- **Active Features**: [Y features in progress]
- **Completed Features**: [Z features deployed]
- **Last Updated**: [Timestamp]

## Feature Status Summary

### 🟢 Completed Features (Ready for Deployment)
| Feature | Requirements | Planning | Implementation | Validation | Deployment |
|---------|-------------|----------|----------------|------------|------------|
| User Authentication | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | 🟡 Pending |
| Payment Processing | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete |

### 🟡 In Progress Features
| Feature | Requirements | Planning | Implementation | Validation | Deployment |
|---------|-------------|----------|----------------|------------|------------|
| User Profile | ✅ Complete | ✅ Complete | 🟡 In Progress | ❌ Not Started | ❌ Not Started |
| Notification System | ✅ Complete | 🟡 In Progress | ❌ Not Started | ❌ Not Started | ❌ Not Started |

### 🔴 Blocked Features
| Feature | Phase | Blocker | Action Required |
|---------|-------|---------|-----------------|
| Admin Dashboard | Implementation | Missing API endpoints | Complete User Profile first |
| Reporting Module | Planning | Requirements unclear | Stakeholder review needed |

## Phase Analysis

### Requirements Phase
- **Complete**: 8 features
- **In Progress**: 2 features
- **Not Started**: 1 feature
- **Bottlenecks**: Stakeholder availability for requirements review

### Planning Phase
- **Complete**: 6 features
- **In Progress**: 3 features
- **Not Started**: 2 features
- **Bottlenecks**: Architecture decisions pending for complex features

### Implementation Phase
- **Complete**: 4 features
- **In Progress**: 4 features
- **Not Started**: 3 features
- **Bottlenecks**: Developer capacity, dependency on external APIs

### Validation Phase
- **Complete**: 3 features
- **In Progress**: 1 feature
- **Not Started**: 7 features
- **Bottlenecks**: Test environment setup, QA resource allocation

### Deployment Phase
- **Complete**: 2 features
- **Ready**: 1 feature
- **Not Ready**: 8 features
- **Bottlenecks**: DevOps pipeline configuration

## Recommendations

### Immediate Actions
1. **Unblock Admin Dashboard**: Complete User Profile implementation
2. **Clarify Reporting Requirements**: Schedule stakeholder meeting
3. **Accelerate Validation**: Set up automated testing pipeline

### Process Improvements
1. **Requirements**: Implement requirements review checklist
2. **Planning**: Create architecture decision templates
3. **Implementation**: Establish code review standards
4. **Validation**: Automate acceptance criteria testing

### Resource Allocation
- **High Priority**: User Profile completion (blocking 2 features)
- **Medium Priority**: Notification System planning
- **Low Priority**: New feature requirements gathering
```

## Phase 3: Bottleneck Identification

I'll identify bottlenecks and suggest solutions:

**Bottleneck Analysis:**
- Phase-specific delays and their causes
- Resource constraints and capacity issues
- Dependency chains and critical path analysis
- Process inefficiencies and improvement opportunities

**Next Action Suggestions:**
- Specific tasks to unblock progress
- Resource reallocation recommendations
- Process improvements to prevent future bottlenecks
- Priority adjustments based on business impact

## Phase 4: Deployment Readiness Assessment

I'll assess deployment readiness for completed features:

**Readiness Checklist:**
- All requirements implemented and validated
- Code review and quality assurance complete
- Security scan passed
- Performance testing completed
- Documentation updated
- Deployment pipeline configured

**Deployment Status:**
- **Ready**: All criteria met, can deploy immediately
- **Pending**: Minor issues to resolve before deployment
- **Blocked**: Significant issues preventing deployment
- **Not Ready**: Major work remaining

## Phase 5: Progress Visualization & Reporting

I'll provide visual progress indicators:

**Progress Metrics:**
- Feature completion percentages by phase
- Velocity trends and throughput analysis
- Bottleneck frequency and resolution time
- Resource utilization and capacity planning

**Trend Analysis:**
- Feature delivery velocity over time
- Common bottleneck patterns
- Process improvement impact measurement
- Predictive completion estimates

## Context Continuity

**Session Resume:**
When you return and run `/feature-status` or `/feature-status resume`:
- Load existing status dashboard and tracking
- Show recent progress and changes
- Continue status management from last point
- Maintain all feature tracking history

**Progress Example:**
```
RESUMING FEATURE STATUS SESSION
├── Features Tracked: 11
├── Recent Changes: User Profile moved to Validation phase
├── New Bottlenecks: 2 features blocked on API dependencies
└── Next Review: Deployment readiness for Payment Processing

Continuing feature lifecycle tracking...
```

## Practical Examples

**Check Feature Status:**
```
/feature-status                    # Show complete dashboard
/feature-status UserProfile       # Focus on specific feature
/feature-status dashboard          # Show project overview
```

**Status Management:**
```
/feature-status summary    # Quick status summary
/feature-status bottlenecks # Focus on blocked features
/feature-status ready      # Show deployment-ready features
```

## Integration with Development Workflow

**Workflow Integration:**
- Update status when `/requirements` completes
- Track progress when `/plan` creates implementation plan
- Monitor implementation through code commits
- Update validation status from `/validate-implementation`
- Prepare deployment checklists for ready features

**Command Suggestions:**
Based on status analysis, I may suggest:
- `/requirements` for features needing requirements
- `/plan` for features ready for planning
- `/implement` for features ready for development
- `/validate-implementation` for features needing validation
- `/review` for features needing quality assurance

## Safety Guarantees

**Protection Measures:**
- Non-destructive status tracking
- Historical progress preservation
- Accurate bottleneck identification
- Reliable deployment readiness assessment

**Important:** I will NEVER:
- Modify feature implementation during status tracking
- Make deployment decisions without proper validation
- Skip critical readiness checks
- Add AI attribution to status reports

## Command Integration

After status analysis, I may suggest:
- `/plan` - For features needing implementation planning
- `/validate-implementation` - For features needing validation
- `/retrospective` - For completed features needing analysis
- `/commit` - For features ready for deployment

## What I'll Actually Do

1. **Scan comprehensively** - Find all feature lifecycle artifacts
2. **Track systematically** - Monitor progress across all phases
3. **Identify bottlenecks** - Find and analyze blocking issues
4. **Assess readiness** - Evaluate deployment preparedness
5. **Visualize progress** - Create clear status dashboards
6. **Suggest actions** - Provide specific next steps

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of feature progress and bottleneck analysis.