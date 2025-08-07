# Feature Retrospective

I'll conduct comprehensive post-completion analysis of features to identify lessons learned and process improvements, with trend analysis across multiple features for continuous improvement.

Arguments: `$ARGUMENTS` - feature name or retrospective focus area

## Session Intelligence

I'll maintain retrospective analysis across sessions:

**Session Files (in current project directory):**
- `retrospective/analysis.md` - Retrospective findings and recommendations
- `retrospective/state.json` - Learning tracking and trend analysis

**IMPORTANT:** Session files are stored in a `retrospective` folder in your current project root

**Auto-Detection:**
- If session exists: Resume retrospective analysis
- If no session: Create new retrospective assessment
- Commands: `resume`, `trends`, `summary`

## Phase 1: Complete Lifecycle Analysis

**MANDATORY FIRST STEPS:**
1. Check if `retrospective` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `retrospective/state.json`
   - Look for `retrospective/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze complete feature development lifecycle
   - Load all related artifacts and history
   - Create comprehensive retrospective analysis
4. Show retrospective summary before detailed analysis

**Lifecycle Data Collection:**
- Use **Read** to analyze requirements, plans, and validation reports
- Use **Grep** to find implementation commits and code changes
- Use **Glob** to discover all feature-related artifacts
- Analyze git history for timeline and effort tracking

## Phase 2: Planned vs Actual Analysis

### Extended Thinking for Complex Retrospective Analysis

For complex retrospective scenarios, I'll use extended thinking to identify deeper patterns:

<think>
When analyzing complex project outcomes:
- Systemic issues that contributed to deviations from plan
- Hidden dependencies and their impact on timeline and scope
- Team dynamics and communication patterns that affected delivery
- Technical debt accumulation and its long-term implications
- Decision-making processes and their effectiveness
- Risk management strategies and their actual effectiveness
- Knowledge transfer and learning opportunities that were missed
- Process improvements that could prevent similar issues in future projects
</think>

**Triggers for Extended Analysis:**
- Significant timeline or scope deviations
- Complex technical implementations
- Multi-team coordination challenges
- Novel technology or architecture decisions
- High-stakes or business-critical features

I'll compare original plans with actual outcomes:

**Comparison Analysis:**
- **Timeline**: Planned vs actual development time
- **Scope**: Original requirements vs delivered features
- **Effort**: Estimated vs actual development effort
- **Quality**: Planned vs actual defect rates and issues
- **Resources**: Planned vs actual team involvement

**Variance Analysis:**
- Identify significant deviations from plan
- Analyze root causes of timeline slippages
- Evaluate scope creep and requirement changes
- Assess effort estimation accuracy
- Review resource allocation effectiveness

## Phase 3: Pattern Identification

I'll identify patterns across multiple completed features:

**Success Patterns:**
- What consistently works well in your development process
- Effective planning and estimation approaches
- Successful implementation strategies
- Quality assurance practices that prevent issues

**Problem Patterns:**
- Recurring bottlenecks and delays
- Common estimation errors
- Frequent requirement changes
- Quality issues and their root causes

**Retrospective Analysis Creation:**
I'll create `retrospective/analysis.md` with:

```markdown
# Feature Retrospective Analysis - [Feature Name]

## Executive Summary
- **Feature**: [Feature Name]
- **Completion Date**: [Date]
- **Total Duration**: [X weeks/months]
- **Team Size**: [Y developers]
- **Overall Assessment**: [Success/Partial Success/Needs Improvement]

## Timeline Analysis

### Planned vs Actual
| Phase | Planned Duration | Actual Duration | Variance | Notes |
|-------|-----------------|-----------------|----------|-------|
| Requirements | 1 week | 2 weeks | +100% | Stakeholder availability issues |
| Planning | 3 days | 5 days | +67% | Architecture decisions took longer |
| Implementation | 4 weeks | 6 weeks | +50% | Unexpected API integration complexity |
| Validation | 1 week | 1 week | 0% | Went as planned |
| Deployment | 2 days | 3 days | +50% | Environment configuration issues |

**Total Variance**: +43% over planned timeline

## Scope Analysis

### Requirements Evolution
- **Original Requirements**: 12 user stories
- **Final Requirements**: 15 user stories (+25%)
- **Scope Changes**: 3 additions, 0 removals
- **Change Drivers**: User feedback during development, technical discoveries

### Feature Completeness
- **Fully Implemented**: 13 requirements (87%)
- **Partially Implemented**: 2 requirements (13%)
- **Deferred**: 0 requirements
- **Quality**: All acceptance criteria met for implemented features

## Effort Analysis

### Estimation Accuracy
- **Planned Effort**: 160 hours
- **Actual Effort**: 220 hours (+38%)
- **Most Underestimated**: API integration (planned 20h, actual 45h)
- **Most Accurate**: UI implementation (planned 40h, actual 42h)

### Effort Distribution
- **Requirements**: 15% (planned 10%)
- **Planning**: 8% (planned 5%)
- **Implementation**: 65% (planned 70%)
- **Testing**: 12% (planned 15%)

## Quality Analysis

### Defects and Issues
- **Pre-deployment Issues**: 8 issues found
- **Post-deployment Issues**: 2 issues found
- **Critical Issues**: 0
- **Issue Resolution Time**: Average 1.2 days

### Code Quality Metrics
- **Test Coverage**: 87% (target: 80%)
- **Code Review Coverage**: 100%
- **Security Scan**: No critical issues
- **Performance**: Meets all requirements

## What Went Well

### Process Successes
1. **Clear Requirements**: EARS format prevented ambiguity
2. **Incremental Planning**: Task breakdown enabled parallel work
3. **Regular Validation**: Early issue detection saved time
4. **Code Reviews**: Prevented 6 potential bugs

### Technical Successes
1. **Architecture Decisions**: ADR process provided clear guidance
2. **Test-Driven Development**: Reduced debugging time by 30%
3. **Continuous Integration**: Automated testing caught issues early

## What Didn't Go Well

### Process Issues
1. **Stakeholder Availability**: Requirements phase delayed by 1 week
2. **Estimation Accuracy**: Consistently underestimated integration work
3. **Environment Setup**: Deployment delays due to configuration issues

### Technical Issues
1. **API Documentation**: Third-party API docs were incomplete
2. **Legacy Integration**: Older system integration more complex than expected
3. **Performance Testing**: Load testing revealed late-stage bottlenecks

## Lessons Learned

### For Future Projects
1. **Buffer Time**: Add 25% buffer for integration work
2. **Stakeholder Management**: Secure dedicated time commitments upfront
3. **Environment Preparation**: Set up deployment pipeline during planning
4. **API Validation**: Validate third-party APIs during planning phase

### Process Improvements
1. **Estimation**: Use historical data for better accuracy
2. **Risk Management**: Identify integration risks earlier
3. **Communication**: Establish clearer stakeholder communication protocols
4. **Testing**: Include performance testing in implementation phase

## Recommendations

### Immediate Actions
1. Update estimation templates with integration complexity factors
2. Create stakeholder availability checklist for requirements phase
3. Develop deployment environment setup checklist
4. Document API validation process for planning phase

### Process Changes
1. **Planning Phase**: Add mandatory risk assessment step
2. **Implementation Phase**: Include mid-phase performance testing
3. **Validation Phase**: Add stakeholder sign-off checkpoint
4. **Deployment Phase**: Implement automated environment validation

### Team Development
1. **Training**: API integration best practices workshop
2. **Documentation**: Create integration complexity estimation guide
3. **Tools**: Evaluate automated performance testing tools
4. **Knowledge Sharing**: Regular architecture decision review sessions

## Metrics for Next Feature
- **Timeline Buffer**: 25% for integration-heavy features
- **Stakeholder Time**: Secure 2-hour weekly commitment minimum
- **Environment Setup**: Complete 1 week before deployment
- **Performance Testing**: Start at 50% implementation completion
```

## Phase 4: Trend Analysis Across Features

I'll analyze patterns across multiple completed features:

**Multi-Feature Analysis:**
- Common bottlenecks and their frequency
- Estimation accuracy trends over time
- Quality improvement patterns
- Process effectiveness evolution

**Trend Identification:**
- Improving areas (getting better over time)
- Persistent problems (recurring issues)
- Emerging patterns (new challenges)
- Success factors (consistent wins)

## Phase 5: Process Improvement Recommendations

I'll generate actionable process improvements:

**Systematic Improvements:**
- Template updates based on lessons learned
- Process modifications to prevent recurring issues
- Tool recommendations for identified pain points
- Training needs based on skill gaps

**Team Playbook Updates:**
- Best practices documentation
- Estimation guidelines and historical data
- Risk assessment checklists
- Quality assurance improvements

## Context Continuity

**Session Resume:**
When you return and run `/retrospective` or `/retrospective resume`:
- Load existing retrospective analysis and trends
- Show recent insights and recommendations
- Continue analysis from last point
- Maintain all learning history

**Progress Example:**
```
RESUMING RETROSPECTIVE SESSION
├── Features Analyzed: 5
├── Current: User Authentication retrospective
├── Trends Identified: 3 recurring patterns
└── Recommendations: 8 process improvements generated

Continuing retrospective analysis...
```

## Practical Examples

**Conduct Retrospective:**
```
/retrospective UserProfile        # Analyze specific feature
/retrospective "payment system"   # Analyze feature group
/retrospective trends             # Focus on cross-feature patterns
```

**Analysis Management:**
```
/retrospective summary    # Quick retrospective summary
/retrospective lessons    # Focus on lessons learned
/retrospective recommendations # Show improvement suggestions
```

## Integration with Development Process

**Continuous Improvement:**
- Update planning templates with lessons learned
- Enhance estimation accuracy with historical data
- Improve risk assessment with identified patterns
- Refine quality processes based on defect analysis

**Knowledge Management:**
- Update team playbooks with best practices
- Document successful patterns for reuse
- Create training materials for identified skill gaps
- Maintain organizational learning repository

## Safety Guarantees

**Protection Measures:**
- Objective analysis without blame assignment
- Focus on process improvement over individual performance
- Constructive recommendations for future success
- Historical data preservation for trend analysis

**Important:** I will NEVER:
- Assign blame to individuals for project issues
- Make recommendations without data support
- Skip positive pattern identification
- Add AI attribution to retrospective reports

## Command Integration

After retrospective completion, I may suggest:
- `/requirements` - To apply lessons to new features
- `/plan` - To incorporate improvements in planning
- `/adr` - To document process decisions
- `/feature-status` - To track improvement implementation

## What I'll Actually Do

1. **Analyze comprehensively** - Complete lifecycle from requirements to deployment
2. **Compare systematically** - Planned vs actual across all dimensions
3. **Identify patterns** - Success factors and recurring issues
4. **Learn continuously** - Extract actionable lessons
5. **Recommend specifically** - Provide concrete process improvements
6. **Track trends** - Monitor improvement over time

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of retrospective analysis and improvement recommendations.