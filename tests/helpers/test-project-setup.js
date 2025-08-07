/**
 * Test Project Setup Utilities
 * Provides utilities for setting up and managing test projects
 */

const { setupMockProject, addMockFiles, removeMockFiles } = require('./mock-claude-tools');
const path = require('path');

/**
 * Set up a test project with specified configuration
 */
async function setupTestProject(projectType, options = {}) {
  const project = {
    type: projectType,
    options,
    structure: setupMockProject(projectType, options),
    createdAt: new Date(),
    tempFiles: [],
    sessions: new Map()
  };

  // Add any additional files specified in options
  if (options.additionalFiles) {
    addMockFiles(options.additionalFiles);
    project.tempFiles.push(...Object.keys(options.additionalFiles));
  }

  return project;
}

/**
 * Clean up test project resources
 */
async function cleanupTestProject(project) {
  if (!project) return;

  // Remove temporary files
  if (project.tempFiles.length > 0) {
    removeMockFiles(project.tempFiles);
  }

  // Clear any session data
  project.sessions.clear();

  // Reset project state
  project.structure = null;
}

/**
 * Create mock session files for testing session continuity
 */
async function createMockSession(project, commandType, sessionData) {
  const sessionDir = `${commandType}/`;
  const planFile = `${sessionDir}plan.md`;
  const stateFile = `${sessionDir}state.json`;

  // Create session directory structure
  const sessionFiles = {
    [planFile]: generateMockPlan(commandType, sessionData),
    [stateFile]: JSON.stringify({
      command: commandType,
      feature: sessionData.feature || 'TestFeature',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      progress: sessionData.progress || 'in_progress',
      ...sessionData
    }, null, 2)
  };

  addMockFiles(sessionFiles);
  project.tempFiles.push(...Object.keys(sessionFiles));
  project.sessions.set(commandType, sessionData);

  return { planFile, stateFile };
}

/**
 * Generate mock plan content based on command type
 */
function generateMockPlan(commandType, sessionData) {
  switch (commandType) {
    case 'requirements':
      return generateRequirementsPlan(sessionData);
    case 'plan':
      return generateImplementationPlan(sessionData);
    case 'validate-implementation':
      return generateValidationPlan(sessionData);
    case 'adr':
      return generateADRPlan(sessionData);
    case 'feature-status':
      return generateStatusPlan(sessionData);
    case 'retrospective':
      return generateRetrospectivePlan(sessionData);
    default:
      return `# ${commandType} Plan\n\nGenerated for testing purposes.`;
  }
}

function generateRequirementsPlan(sessionData) {
  return `# Requirements Document - ${sessionData.feature || 'TestFeature'}

## Introduction

This feature enables users to manage their profiles effectively.

## Requirements

### Requirement 1: User Registration
**User Story:** As a new user, I want to register an account, so that I can access the system.

#### Acceptance Criteria
1. WHEN user provides valid email and password THEN system SHALL create account
2. IF email already exists THEN system SHALL return error message
3. WHEN registration successful THEN system SHALL send confirmation email

### Requirement 2: Profile Management
**User Story:** As a registered user, I want to update my profile, so that my information stays current.

#### Acceptance Criteria
1. WHEN user updates profile information THEN system SHALL save changes
2. WHEN user uploads avatar THEN system SHALL validate file type and size
3. IF validation fails THEN system SHALL show specific error message

## Technical Requirements
- JWT authentication integration
- Input validation using Joi
- PostgreSQL database integration
- File upload handling for avatars

## Success Criteria
- User registration success rate > 95%
- Profile update response time < 2 seconds
- Avatar upload success rate > 90%
`;
}

function generateImplementationPlan(sessionData) {
  return `# Implementation Plan - ${sessionData.feature || 'TestFeature'}

## Requirements Reference
- **Source**: requirements/plan.md
- **Requirements Count**: 2 user stories, 4 technical requirements
- **Validation Status**: Complete

## Architecture Analysis
- **Current Architecture**: React frontend with Express.js backend
- **Integration Points**: Authentication service, User management API
- **Technology Stack**: React, Express.js, PostgreSQL, JWT
- **Constraints**: Must maintain backward compatibility

## Implementation Tasks

### Phase 1: Backend Implementation
- [ ] 1.1 Create User model with validation
  - Implement User entity with Sequelize
  - Add email uniqueness constraint
  - Write model validation tests
  - **Effort**: 4-6 hours | **Risk**: Low
  - **Dependencies**: None
  - **Requirements**: Req 1.1, 1.2

- [ ] 1.2 Implement authentication endpoints
  - Create registration endpoint
  - Add login endpoint with JWT
  - Implement password hashing
  - **Effort**: 6-8 hours | **Risk**: Medium
  - **Dependencies**: 1.1
  - **Requirements**: Req 1.1, 1.3

### Phase 2: Frontend Implementation
- [ ] 2.1 Create registration form
  - Build React registration component
  - Add form validation
  - Implement error handling
  - **Effort**: 4-6 hours | **Risk**: Low
  - **Dependencies**: 1.2
  - **Requirements**: Req 1.1

- [ ] 2.2 Create profile management interface
  - Build profile edit component
  - Add avatar upload functionality
  - Implement real-time validation
  - **Effort**: 8-10 hours | **Risk**: Medium
  - **Dependencies**: 1.1, 2.1
  - **Requirements**: Req 2.1, 2.2

### Phase 3: Integration & Testing
- [ ] 3.1 End-to-end testing
  - Write integration tests
  - Test complete user flows
  - Performance testing
  - **Effort**: 6-8 hours | **Risk**: Low
  - **Dependencies**: All previous tasks
  - **Requirements**: All requirements

## Risk Assessment
- **Medium Risk**: File upload implementation complexity
- **Low Risk**: Standard CRUD operations

## Critical Path
1. Backend foundation (1.1, 1.2) - 10-14 hours
2. Frontend implementation (2.1, 2.2) - 12-16 hours
3. Integration testing (3.1) - 6-8 hours
**Total Estimated Effort**: 28-38 hours
`;
}

function generateValidationPlan(sessionData) {
  return `# Implementation Validation Report - ${sessionData.feature || 'TestFeature'}

## Validation Summary
- **Requirements Analyzed**: 2 of 2 requirements
- **Acceptance Criteria**: 6 of 6 criteria met
- **Overall Coverage**: 100%
- **Validation Status**: Complete

## Requirements Traceability Matrix

### Requirement 1: User Registration
- **Status**: ✅ Complete
- **Implementation**: server/routes/auth.js:15-45, src/components/RegisterForm.js:10-80
- **Acceptance Criteria**:
  - ✅ WHEN user provides valid email and password THEN system SHALL create account
  - ✅ IF email already exists THEN system SHALL return error message
  - ✅ WHEN registration successful THEN system SHALL send confirmation email

### Requirement 2: Profile Management
- **Status**: ✅ Complete
- **Implementation**: server/routes/profile.js:20-60, src/components/ProfileForm.js:15-120
- **Acceptance Criteria**:
  - ✅ WHEN user updates profile information THEN system SHALL save changes
  - ✅ WHEN user uploads avatar THEN system SHALL validate file type and size
  - ✅ IF validation fails THEN system SHALL show specific error message

## Gap Analysis

### No Critical Gaps Found
All requirements have been successfully implemented and validated.

## Implementation Quality Assessment
- **Code Quality**: Excellent - follows project conventions
- **Test Coverage**: 95% coverage, comprehensive test suite
- **Performance**: All response times under 2 seconds
- **Security**: JWT implementation secure, input validation complete
- **Documentation**: API documentation updated, README current

## Next Steps
- [ ] Deploy to staging environment
- [ ] Conduct user acceptance testing
- [ ] Update production deployment checklist
`;
}

function generateADRPlan(sessionData) {
  return `# Architecture Decision Records

## Decision Index

### ADR-001: Database Choice for User Management
- **Status**: Accepted
- **Date**: 2025-01-15
- **Decision**: Use PostgreSQL for user data storage
- **Rationale**: ACID compliance, JSON support, team expertise

### ADR-002: Authentication Strategy
- **Status**: Accepted  
- **Date**: 2025-01-16
- **Decision**: Implement JWT-based authentication
- **Rationale**: Stateless, scalable, industry standard

### ADR-003: File Upload Strategy
- **Status**: Proposed
- **Date**: 2025-01-17
- **Decision**: Use cloud storage for avatar uploads
- **Rationale**: Scalability, CDN benefits, cost efficiency

## Recent Decisions

The most recent architectural decision (ADR-003) is currently under review.
Key considerations include cost implications and integration complexity.
`;
}

function generateStatusPlan(sessionData) {
  return `# Feature Status Dashboard

## Project Overview
- **Total Features**: 5 features tracked
- **Active Features**: 3 features in progress
- **Completed Features**: 2 features deployed
- **Last Updated**: ${new Date().toISOString()}

## Feature Status Summary

### 🟢 Completed Features (Ready for Deployment)
| Feature | Requirements | Planning | Implementation | Validation | Deployment |
|---------|-------------|----------|----------------|------------|------------|
| User Authentication | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete |
| Basic Profile | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | 🟡 Pending |

### 🟡 In Progress Features
| Feature | Requirements | Planning | Implementation | Validation | Deployment |
|---------|-------------|----------|----------------|------------|------------|
| Advanced Profile | ✅ Complete | ✅ Complete | 🟡 In Progress | ❌ Not Started | ❌ Not Started |
| Notification System | ✅ Complete | 🟡 In Progress | ❌ Not Started | ❌ Not Started | ❌ Not Started |
| Payment Integration | 🟡 In Progress | ❌ Not Started | ❌ Not Started | ❌ Not Started | ❌ Not Started |

## Recommendations

### Immediate Actions
1. **Complete Advanced Profile**: 70% implementation complete
2. **Finalize Notification Planning**: Architecture decisions needed
3. **Gather Payment Requirements**: Stakeholder input required

### Process Improvements
1. **Requirements**: Implement stakeholder review checklist
2. **Planning**: Add dependency analysis step
3. **Implementation**: Establish code review standards
`;
}

function generateRetrospectivePlan(sessionData) {
  return `# Feature Retrospective Analysis - ${sessionData.feature || 'TestFeature'}

## Executive Summary
- **Feature**: ${sessionData.feature || 'TestFeature'}
- **Completion Date**: ${new Date().toISOString().split('T')[0]}
- **Total Duration**: 4 weeks
- **Team Size**: 3 developers
- **Overall Assessment**: Success

## Timeline Analysis

### Planned vs Actual
| Phase | Planned Duration | Actual Duration | Variance | Notes |
|-------|-----------------|-----------------|----------|-------|
| Requirements | 3 days | 5 days | +67% | Stakeholder availability issues |
| Planning | 2 days | 3 days | +50% | Architecture decisions took longer |
| Implementation | 2 weeks | 2.5 weeks | +25% | File upload complexity |
| Validation | 3 days | 2 days | -33% | Good test coverage helped |
| Deployment | 1 day | 1 day | 0% | Went as planned |

**Total Variance**: +20% over planned timeline

## What Went Well

### Process Successes
1. **Clear Requirements**: EARS format prevented ambiguity
2. **Incremental Planning**: Task breakdown enabled parallel work
3. **Regular Validation**: Early issue detection saved time
4. **Good Test Coverage**: Reduced debugging time

### Technical Successes
1. **Architecture Decisions**: ADR process provided clear guidance
2. **Code Reviews**: Prevented 4 potential bugs
3. **Automated Testing**: CI/CD pipeline caught issues early

## What Didn't Go Well

### Process Issues
1. **Stakeholder Availability**: Requirements phase delayed
2. **File Upload Complexity**: Underestimated implementation time
3. **Integration Testing**: Environment setup took longer than expected

## Lessons Learned

### For Future Projects
1. **Buffer Time**: Add 25% buffer for file handling features
2. **Stakeholder Management**: Secure dedicated time commitments
3. **Environment Preparation**: Set up test environments earlier
4. **Complexity Assessment**: Better estimation for file operations

## Recommendations

### Immediate Actions
1. Update estimation templates with file handling complexity factors
2. Create stakeholder availability checklist
3. Develop environment setup automation
4. Document file upload patterns for reuse

### Process Changes
1. **Planning Phase**: Add mandatory complexity assessment
2. **Implementation Phase**: Include environment setup in estimates
3. **Validation Phase**: Automate integration test environment setup
`;
}

/**
 * Simulate implementation completion for testing
 */
async function simulateImplementation(project, featureName, tasks = []) {
  const implementationFiles = {
    [`src/components/${featureName}Form.js`]: `
      import React, { useState } from 'react';
      
      const ${featureName}Form = () => {
        const [formData, setFormData] = useState({});
        
        const handleSubmit = (e) => {
          e.preventDefault();
          // Implementation logic
        };
        
        return (
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
          </form>
        );
      };
      
      export default ${featureName}Form;
    `,
    [`server/routes/${featureName.toLowerCase()}.js`]: `
      const express = require('express');
      const router = express.Router();
      
      router.get('/', (req, res) => {
        res.json({ message: '${featureName} endpoint' });
      });
      
      router.post('/', (req, res) => {
        // Implementation logic
        res.json({ success: true });
      });
      
      module.exports = router;
    `,
    [`tests/${featureName}.test.js`]: `
      import React from 'react';
      import { render } from '@testing-library/react';
      import ${featureName}Form from '../src/components/${featureName}Form';
      
      describe('${featureName}Form', () => {
        it('should render correctly', () => {
          const { container } = render(<${featureName}Form />);
          expect(container).toBeInTheDocument();
        });
      });
    `
  };

  addMockFiles(implementationFiles);
  project.tempFiles.push(...Object.keys(implementationFiles));

  return {
    success: true,
    filesCreated: Object.keys(implementationFiles).length,
    tasksCompleted: tasks.length
  };
}

/**
 * Create corrupted files for error testing
 */
async function createCorruptedFile(project, filePath) {
  const corruptedContent = '{"invalid": json content without closing brace';
  addMockFiles({ [filePath]: corruptedContent });
  project.tempFiles.push(filePath);
}

/**
 * Get project statistics for testing
 */
function getProjectStats(project) {
  return {
    type: project.type,
    filesCount: project.tempFiles.length,
    sessionsCount: project.sessions.size,
    createdAt: project.createdAt,
    structure: project.structure
  };
}

module.exports = {
  setupTestProject,
  cleanupTestProject,
  createMockSession,
  simulateImplementation,
  createCorruptedFile,
  getProjectStats,
  generateMockPlan
};