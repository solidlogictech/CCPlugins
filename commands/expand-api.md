# Expand API Endpoints

I'll analyze existing API patterns and create similar endpoints following your established conventions, maintaining consistency in routing, validation, error handling, and documentation.

Arguments: `$ARGUMENTS` - endpoint pattern, resource name, or API focus area

## Session Intelligence

I'll maintain API expansion progress across sessions:

**Session Files (in current project directory):**
- `expand-api/analysis.md` - API pattern analysis and expansion plan
- `expand-api/state.json` - Expansion progress and generated endpoints

**IMPORTANT:** Session files are stored in an `expand-api` folder in your current project root

**Auto-Detection:**
- If session exists: Resume API expansion
- If no session: Create new API analysis
- Commands: `resume`, `patterns`, `endpoints`

## Phase 1: API Pattern Discovery & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `expand-api` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `expand-api/state.json`
   - Look for `expand-api/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze existing API patterns and structure
   - Identify routing conventions and frameworks
   - Create API expansion plan
4. Show API analysis summary before expansion

**API Pattern Discovery:**
- Use **Glob** to find API route files, controllers, and middleware
- Use **Read** to analyze existing endpoint implementations
- Use **Grep** to identify routing patterns, validation, and error handling
- Analyze API documentation and OpenAPI/Swagger specifications

## Phase 2: Framework & Convention Detection

I'll identify your API architecture and conventions:

**Framework Detection:**
- API framework (Express, FastAPI, Spring Boot, Rails, etc.)
- Routing patterns and URL structure
- Middleware usage and request/response flow
- Authentication and authorization patterns

**Convention Analysis:**
- URL naming conventions (REST, GraphQL, RPC)
- HTTP method usage patterns
- Request/response data formats
- Error handling and status code patterns
- Validation and sanitization approaches

## Phase 3: Endpoint Pattern Analysis

### Extended Thinking for Complex API Expansion

For complex API expansion scenarios, I'll use extended thinking to ensure comprehensive design:

<think>
When expanding complex API patterns:
- Consistency with existing API design principles and RESTful conventions
- Authentication and authorization patterns that scale across endpoints
- Data validation and sanitization strategies for security
- Error handling patterns that provide meaningful feedback
- Performance implications of new endpoints on existing infrastructure
- Versioning strategies and backwards compatibility considerations
- Rate limiting and abuse prevention for new endpoints
- Documentation and testing patterns that maintain API quality
</think>

**Triggers for Extended Analysis:**
- Security-sensitive endpoints
- High-traffic or performance-critical APIs
- Complex data relationships and queries
- Integration with external services
- Multi-tenant or role-based access scenarios

I'll analyze existing endpoints to understand patterns:

**Pattern Identification:**
- CRUD operation implementations
- Resource relationship handling
- Pagination and filtering patterns
- Authentication and authorization checks
- Input validation and error responses

**API Expansion Planning:**
I'll create `expand-api/analysis.md` with:

```markdown
# API Expansion Analysis

## Current API Architecture
- **Framework**: Express.js with TypeScript
- **Pattern**: RESTful API with resource-based routing
- **Authentication**: JWT tokens with middleware validation
- **Documentation**: OpenAPI 3.0 with Swagger UI

## Existing API Patterns

### URL Structure
- **Base URL**: `/api/v1`
- **Resource Pattern**: `/api/v1/{resource}` and `/api/v1/{resource}/{id}`
- **Nested Resources**: `/api/v1/{parent}/{parentId}/{child}`
- **Actions**: `/api/v1/{resource}/{id}/{action}` (non-CRUD operations)

### HTTP Method Conventions
- **GET** `/users` - List users with pagination
- **GET** `/users/{id}` - Get specific user
- **POST** `/users` - Create new user
- **PUT** `/users/{id}` - Update entire user
- **PATCH** `/users/{id}` - Partial user update
- **DELETE** `/users/{id}` - Delete user

### Standard Response Format
```javascript
// Success Response
{
  "success": true,
  "data": { /* resource data */ },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1"
  }
}
```

### Authentication Pattern
```javascript
// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'MISSING_TOKEN', message: 'Access token required' }
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid access token' }
      });
    }
    req.user = user;
    next();
  });
};
```

### Validation Pattern
```javascript
// Using Joi for validation
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }
    next();
  };
};
```

## Expansion Opportunities

### Missing CRUD Endpoints
1. **Projects Resource** - Following user pattern
   - **GET** `/api/v1/projects` - List projects
   - **GET** `/api/v1/projects/{id}` - Get project
   - **POST** `/api/v1/projects` - Create project
   - **PUT** `/api/v1/projects/{id}` - Update project
   - **DELETE** `/api/v1/projects/{id}` - Delete project

2. **Teams Resource** - Following user pattern
   - **GET** `/api/v1/teams` - List teams
   - **GET** `/api/v1/teams/{id}` - Get team
   - **POST** `/api/v1/teams` - Create team
   - **PUT** `/api/v1/teams/{id}` - Update team
   - **DELETE** `/api/v1/teams/{id}` - Delete team

### Nested Resource Patterns
1. **User Projects** - `/api/v1/users/{userId}/projects`
2. **Team Members** - `/api/v1/teams/{teamId}/members`
3. **Project Tasks** - `/api/v1/projects/{projectId}/tasks`

### Action Endpoints
1. **User Actions**
   - **POST** `/api/v1/users/{id}/activate` - Activate user
   - **POST** `/api/v1/users/{id}/deactivate` - Deactivate user
   - **POST** `/api/v1/users/{id}/reset-password` - Reset password

2. **Project Actions**
   - **POST** `/api/v1/projects/{id}/archive` - Archive project
   - **POST** `/api/v1/projects/{id}/restore` - Restore project
   - **POST** `/api/v1/projects/{id}/duplicate` - Duplicate project

## Generated Endpoint Examples

### Projects Controller
```javascript
// Following existing user controller pattern
class ProjectsController {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const projects = await projectService.list({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        userId: req.user.id
      });
      
      res.json({
        success: true,
        data: projects.items,
        meta: {
          pagination: {
            page: projects.page,
            limit: projects.limit,
            total: projects.total,
            pages: projects.pages
          },
          timestamp: new Date().toISOString(),
          version: 'v1'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve projects'
        }
      });
    }
  }
  
  async create(req, res) {
    // Following existing create pattern...
  }
}
```

## Expansion Plan

### Phase 1: Core CRUD Endpoints
- [ ] Generate Projects resource endpoints
- [ ] Generate Teams resource endpoints
- [ ] Create validation schemas for new resources
- [ ] Add authentication middleware to protected endpoints

### Phase 2: Nested Resources
- [ ] Implement user-project relationships
- [ ] Add team-member management endpoints
- [ ] Create project-task nested resources

### Phase 3: Action Endpoints
- [ ] Add user management actions
- [ ] Implement project lifecycle actions
- [ ] Create bulk operation endpoints

### Phase 4: Documentation & Testing
- [ ] Update OpenAPI specification
- [ ] Generate API documentation
- [ ] Create integration tests for new endpoints
- [ ] Add endpoint monitoring and logging
```

## Phase 4: Endpoint Generation Following Patterns

I'll generate new endpoints matching your established patterns:

**Pattern Matching:**
- Follow existing URL structure and naming conventions
- Use same authentication and authorization patterns
- Match validation and error handling approaches
- Maintain consistent response formats and status codes

**Code Generation:**
- Generate controllers following existing patterns
- Create route definitions matching current structure
- Add validation schemas using same validation library
- Include middleware usage consistent with existing endpoints

## Phase 5: Integration & Documentation

I'll ensure new endpoints integrate with existing API infrastructure:

**Integration Verification:**
- Verify routes register correctly with existing router
- Ensure middleware chain works with new endpoints
- Check authentication and authorization flow
- Validate error handling and logging integration

**Documentation Updates:**
- Update OpenAPI/Swagger specifications
- Generate API documentation for new endpoints
- Create usage examples and integration guides
- Update postman collections or API testing suites

## Context Continuity

**Session Resume:**
When you return and run `/expand-api` or `/expand-api resume`:
- Load existing API analysis and expansion progress
- Show generated endpoints and remaining work
- Continue expansion from last point
- Maintain all pattern analysis and decisions

**Progress Example:**
```
RESUMING API EXPANSION SESSION
├── Pattern: RESTful CRUD endpoints
├── Generated: 8 of 12 planned endpoints
├── Current: Team member management endpoints
└── Next: Project action endpoints

Continuing API expansion...
```

## Practical Examples

**Expand API:**
```
/expand-api projects         # Create project resource endpoints
/expand-api "user actions"   # Add user action endpoints
/expand-api teams            # Generate team management API
```

**Analysis Commands:**
```
/expand-api patterns    # Analyze existing API patterns
/expand-api endpoints   # Show endpoint expansion opportunities
/expand-api docs        # Focus on documentation updates
```

## Integration with Development Workflow

**API Development:**
- Follow existing development and testing patterns
- Maintain API versioning and backward compatibility
- Ensure proper error handling and logging
- Include performance and security considerations

**Quality Assurance:**
- Generate tests following existing test patterns
- Validate endpoint security and authorization
- Check performance and rate limiting
- Ensure proper documentation and examples

## Safety Guarantees

**Protection Measures:**
- Generate endpoints following existing patterns exactly
- Ensure new endpoints don't break existing API
- Validate authentication and authorization requirements
- Maintain API versioning and compatibility

**Important:** I will NEVER:
- Modify existing endpoints without explicit request
- Generate endpoints that don't follow project patterns
- Create security vulnerabilities or bypass authentication
- Add AI attribution to API code or documentation

## Command Integration

After API expansion, I may suggest:
- `/test` - To run API integration tests
- `/review` - To validate API security and quality
- `/docs` - To update API documentation
- `/commit` - To save API improvements

## What I'll Actually Do

1. **Analyze patterns** - Understand existing API structure and conventions
2. **Identify opportunities** - Find missing endpoints and resources
3. **Generate systematically** - Create endpoints following established patterns
4. **Integrate seamlessly** - Ensure compatibility with existing infrastructure
5. **Document thoroughly** - Update API documentation and specifications
6. **Track progress** - Monitor expansion progress and quality

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of API analysis and expansion progress.