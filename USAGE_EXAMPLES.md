# CCPlugins Planning Enhancement - Usage Examples

## Complete Feature Development Workflows

### Example 1: New User Profile Feature

This example demonstrates the complete workflow for developing a new user profile feature from initial idea to deployment.

#### Step 1: Requirements Gathering
```bash
claude "/requirements UserProfile"
```

**What happens:**
- Analyzes existing codebase patterns (React, Express.js, PostgreSQL)
- Generates initial requirements in EARS format
- Creates `requirements/plan.md` with user stories and acceptance criteria
- Identifies technical requirements based on existing patterns

**Sample Output:**
```markdown
# Requirements Document - UserProfile

## Requirements

### Requirement 1: Profile Creation
**User Story:** As a registered user, I want to create my profile, so that other users can learn about me.

#### Acceptance Criteria
1. WHEN user accesses profile creation THEN system SHALL display profile form
2. WHEN user submits valid profile data THEN system SHALL save profile
3. IF required fields missing THEN system SHALL show validation errors
```

#### Step 2: Implementation Planning
```bash
claude "/plan UserProfile"
```

**What happens:**
- Loads requirements from previous step
- Analyzes project architecture for implementation approach
- Creates detailed task breakdown with effort estimates
- Identifies dependencies and integration points

**Sample Output:**
```markdown
# Implementation Plan - UserProfile

## Implementation Tasks

### Phase 1: Backend Implementation
- [ ] 1.1 Create UserProfile model with validation
  - **Effort**: 4-6 hours | **Risk**: Low
  - **Requirements**: Req 1.1, 1.2

- [ ] 1.2 Implement profile API endpoints
  - **Effort**: 6-8 hours | **Risk**: Medium
  - **Dependencies**: 1.1
```

#### Step 3: Implementation (using existing CCPlugins)
```bash
claude "/scaffold user-profile"
claude "/implement"
```

#### Step 4: Pattern Expansion
```bash
claude "/expand-tests UserProfile"
claude "/expand-api users"
claude "/expand-components UserProfile"
```

**What happens:**
- Expands test coverage following existing test patterns
- Creates additional API endpoints for profile management
- Generates related UI components with consistent styling

#### Step 5: Validation
```bash
claude "/validate-implementation UserProfile"
```

**What happens:**
- Compares implementation against original requirements
- Creates traceability matrix showing requirement coverage
- Identifies any gaps or missing functionality
- Provides specific remediation guidance

**Sample Output:**
```markdown
# Implementation Validation Report - UserProfile

## Requirements Traceability Matrix

### Requirement 1: Profile Creation
- **Status**: ✅ Complete
- **Implementation**: server/routes/profile.js:20-60, src/components/ProfileForm.js:15-120
- **Coverage**: 100%

## Gap Analysis
### No Critical Gaps Found
All requirements successfully implemented and validated.
```

#### Step 6: Completion and Learning
```bash
claude "/commit"
claude "/retrospective UserProfile"
```

### Example 2: API Expansion Project

This example shows how to expand existing API patterns to create consistent endpoints.

#### Analyze Existing API Patterns
```bash
claude "/expand-api users"
```

**What happens:**
- Analyzes existing user API endpoints
- Identifies patterns for authentication, validation, error handling
- Generates similar endpoints for related resources

**Sample Output:**
```markdown
# API Expansion Analysis

## Existing API Patterns

### URL Structure
- **Base URL**: `/api/v1`
- **Resource Pattern**: `/api/v1/{resource}` and `/api/v1/{resource}/{id}`

### Generated Endpoints
- GET /api/v1/users/{id}/profile
- PUT /api/v1/users/{id}/profile
- DELETE /api/v1/users/{id}/profile
```

#### Expand Related Components
```bash
claude "/expand-components UserProfile"
claude "/expand-models User"
```

#### Validate Consistency
```bash
claude "/validate-implementation UserProfile"
```

### Example 3: Multi-Feature Project Management

This example demonstrates managing multiple features in a large project.

#### Track Overall Project Status
```bash
claude "/feature-status"
```

**Sample Output:**
```markdown
# Feature Status Dashboard

## Feature Status Summary

### 🟢 Completed Features
| Feature | Requirements | Planning | Implementation | Validation | Deployment |
|---------|-------------|----------|----------------|------------|------------|
| User Auth | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete |

### 🟡 In Progress Features
| Feature | Requirements | Planning | Implementation | Validation | Deployment |
|---------|-------------|----------|----------------|------------|------------|
| User Profile | ✅ Complete | ✅ Complete | 🟡 In Progress | ❌ Not Started | ❌ Not Started |

## Recommendations
1. **Complete User Profile**: 70% implementation complete
2. **Start Payment Planning**: Requirements ready for planning phase
```

#### Document Architectural Decisions
```bash
claude "/adr 'User Profile Storage Strategy'"
```

**Sample Output:**
```markdown
# ADR-003: User Profile Storage Strategy

## Status
Accepted

## Context
Need to decide how to store user profile data including photos and preferences.

## Decision
Use PostgreSQL for structured data and AWS S3 for file storage.

## Consequences
### Positive
- Scalable file storage
- ACID compliance for profile data
- Cost-effective for large files

### Negative
- Additional complexity for file management
- Dependency on AWS services
```

#### Conduct Project Retrospective
```bash
claude "/retrospective"
```

**Sample Output:**
```markdown
# Project Retrospective Analysis

## Trends Across Features
- **Average Timeline Variance**: +15% over estimates
- **Common Bottleneck**: File upload implementations
- **Success Pattern**: Clear requirements reduce implementation time by 30%

## Process Improvements
1. **Add 20% buffer for file-handling features**
2. **Create file upload pattern library**
3. **Implement requirements review checklist**
```

## Advanced Usage Patterns

### Pattern 1: Test-Driven Feature Development

```bash
# Start with requirements
claude "/requirements PaymentSystem"

# Create implementation plan
claude "/plan PaymentSystem"

# Expand test coverage first (TDD approach)
claude "/expand-tests PaymentSystem"

# Implement with tests guiding development
claude "/implement"

# Validate against requirements
claude "/validate-implementation PaymentSystem"
```

### Pattern 2: Architecture-First Development

```bash
# Document architectural decisions first
claude "/adr 'Microservices Architecture'"
claude "/adr 'Database Sharding Strategy'"

# Create requirements with architectural constraints
claude "/requirements OrderProcessing"

# Plan implementation considering architecture
claude "/plan OrderProcessing"

# Validate architectural compliance
claude "/validate-implementation OrderProcessing"
```

### Pattern 3: Legacy System Enhancement

```bash
# Understand existing system
claude "/understand"

# Document current architecture
claude "/adr 'Legacy System Integration'"

# Plan incremental improvements
claude "/requirements ModernizeUserSystem"
claude "/plan ModernizeUserSystem"

# Expand patterns gradually
claude "/expand-api legacy-users"
claude "/expand-tests LegacyUserSystem"

# Validate backward compatibility
claude "/validate-implementation ModernizeUserSystem"
```

## Integration with Existing CCPlugins

### Quality Assurance Workflow
```bash
# Complete feature development
claude "/requirements Feature"
claude "/plan Feature"
claude "/implement"

# Quality assurance phase
claude "/expand-tests Feature"        # Expand test coverage
claude "/test"                        # Run all tests
claude "/review"                      # Code quality review
claude "/security-scan"               # Security analysis
claude "/validate-implementation Feature"  # Requirements validation

# Finalization
claude "/format"                      # Code formatting
claude "/commit"                      # Save changes
claude "/retrospective Feature"       # Learn from experience
```

### Continuous Improvement Workflow
```bash
# Regular project health checks
claude "/feature-status"              # Check overall progress
claude "/predict-issues"              # Identify potential problems
claude "/find-todos"                  # Track remaining work

# Process improvement
claude "/retrospective"               # Analyze completed work
claude "/adr 'Process Improvements'"  # Document process decisions

# Knowledge management
claude "/docs"                        # Update documentation
claude "/contributing"                # Prepare for team collaboration
```

## Command Chaining Examples

### New Feature Chain
```bash
claude "/requirements UserNotifications" && \
claude "/plan UserNotifications" && \
claude "/scaffold notifications" && \
claude "/expand-tests UserNotifications" && \
claude "/implement" && \
claude "/validate-implementation UserNotifications" && \
claude "/commit"
```

### Pattern Expansion Chain
```bash
claude "/expand-api notifications" && \
claude "/expand-components Notification" && \
claude "/expand-models Notification" && \
claude "/expand-tests" && \
claude "/test" && \
claude "/commit"
```

### Quality Assurance Chain
```bash
claude "/review" && \
claude "/security-scan" && \
claude "/predict-issues" && \
claude "/validate-implementation Feature" && \
claude "/test" && \
claude "/format" && \
claude "/commit"
```

## Troubleshooting Common Scenarios

### Scenario 1: Requirements Changed Mid-Development

```bash
# Update requirements
claude "/requirements UserProfile"  # Refine existing requirements

# Update implementation plan
claude "/plan UserProfile"          # Plan will detect changes

# Validate current implementation against new requirements
claude "/validate-implementation UserProfile"

# Address any gaps identified
claude "/implement"                 # Fix implementation gaps
```

### Scenario 2: Implementation Doesn't Match Requirements

```bash
# Validate implementation
claude "/validate-implementation Feature"

# Review validation report for specific gaps
# Fix implementation based on gap analysis
claude "/implement"

# Re-validate
claude "/validate-implementation Feature"
```

### Scenario 3: Project Status Unclear

```bash
# Get overall project status
claude "/feature-status"

# Check specific feature progress
claude "/feature-status UserProfile"

# Identify bottlenecks and next actions
# Follow recommended next steps from status report
```

### Scenario 4: Need to Understand Past Decisions

```bash
# Review architectural decisions
claude "/adr list"

# Conduct retrospective analysis
claude "/retrospective FeatureName"

# Check project history and patterns
claude "/understand"
```

## Performance Tips

### For Large Projects
- Use specific feature names to focus analysis
- Run commands on specific directories when possible
- Use session resumption for long-running operations
- Monitor progress with status commands

### For Better Results
- Start with clear, specific requirements
- Use descriptive feature names
- Maintain consistent naming conventions
- Regular validation and retrospective analysis

### For Team Collaboration
- Document architectural decisions with `/adr`
- Use `/feature-status` for project visibility
- Conduct regular retrospectives for process improvement
- Maintain clear requirements and plans for handoffs

This comprehensive set of examples demonstrates how the planning enhancement commands integrate with existing CCPlugins to create powerful development workflows that scale from individual features to large enterprise projects.