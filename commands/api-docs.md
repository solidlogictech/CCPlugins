# API Documentation

I'll automatically generate and maintain comprehensive API documentation from your code, ensuring it stays current with your implementation.

Arguments: `$ARGUMENTS` - API paths, documentation format, or specific endpoints

## Session Intelligence

I'll maintain API documentation progress across sessions:

**Session Files (in current project directory):**
- `api-docs/specification.md` - Generated API documentation
- `api-docs/state.json` - Documentation coverage and updates

**IMPORTANT:** Session files are stored in an `api-docs` folder in your current project root

**Auto-Detection:**
- If session exists: Resume API documentation
- If no session: Create new API analysis
- Commands: `resume`, `generate`, `validate`

## Phase 1: API Discovery and Analysis

**MANDATORY FIRST STEPS:**
1. Check if `api-docs` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `api-docs/state.json`
   - Look for `api-docs/specification.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Scan for API endpoints and route definitions
   - Analyze API framework and documentation patterns
   - Create documentation generation plan
4. Show API documentation preview before generation

**API Framework Detection:**
- Use **Glob** to find API route files and controllers
- Use **Read** to analyze endpoint definitions and middleware
- Use **Grep** to identify API patterns and documentation comments
- Analyze existing API documentation and specifications

## Phase 2: OpenAPI Specification Generation

### Extended Thinking for Complex API Documentation

For complex API documentation scenarios, I'll use extended thinking:

<think>
When documenting complex API architectures:
- Microservices API documentation and service discovery
- API versioning strategies and backward compatibility documentation
- Authentication and authorization flow documentation
- Complex request/response schema validation and examples
- API rate limiting and usage policy documentation
- Integration testing and API contract validation
- Cross-service API dependency mapping and documentation
</think>

**Triggers for Extended Analysis:**
- Microservices architecture with multiple API services
- Complex authentication and authorization flows
- API versioning with multiple concurrent versions
- External API integrations and third-party dependencies

I'll generate comprehensive OpenAPI 3.0 specifications:

**OpenAPI Generation:**
- Automatic endpoint discovery from route definitions
- Request/response schema generation from code annotations
- Parameter validation and type inference
- Authentication scheme documentation
- Error response documentation with examples

**Framework-Specific Integration:**
- **Express.js**: Route analysis and middleware documentation
- **FastAPI**: Automatic OpenAPI generation enhancement
- **Spring Boot**: Annotation-based documentation extraction
- **Django REST**: Serializer and viewset documentation
- **Rails**: Route and controller documentation generation

## Phase 3: Interactive Documentation

I'll create interactive API documentation:

**Documentation Features:**
- Interactive API explorer with request/response examples
- Code samples in multiple programming languages
- Authentication flow documentation and testing
- Real-time API testing and validation
- Comprehensive error handling documentation

**Documentation Formats:**
- **Swagger UI**: Interactive API exploration interface
- **Redoc**: Clean, responsive API documentation
- **Postman Collections**: Importable API testing collections
- **Markdown**: Developer-friendly documentation format

## Phase 4: API Testing Suite Generation

I'll generate comprehensive API test suites:

**Test Generation:**
- Unit tests for individual endpoints
- Integration tests for API workflows
- Contract tests for API compatibility
- Performance tests for API endpoints
- Security tests for authentication and authorization

**Test Framework Integration:**
- **Jest/Mocha**: JavaScript API testing
- **pytest**: Python API testing
- **JUnit**: Java API testing
- **RSpec**: Ruby API testing
- **Postman/Newman**: API testing automation

## Phase 5: Breaking Change Detection

I'll monitor API changes and detect breaking changes:

**Change Detection:**
- Schema evolution tracking and compatibility analysis
- Endpoint deprecation and removal detection
- Parameter and response format change analysis
- API version compatibility validation

**Breaking Change Analysis:**
- Impact assessment for API consumers
- Migration guide generation for breaking changes
- Backward compatibility recommendations
- API versioning strategy suggestions

## Context Continuity

**Session Resume:**
When you return and run `/api-docs` or `/api-docs resume`:
- Load existing API documentation and coverage analysis
- Show documentation updates and endpoint changes
- Continue documentation from last checkpoint
- Maintain all API specification history

**Progress Example:**
```
RESUMING API DOCUMENTATION SESSION
├── Endpoints Documented: 34/38 (89%)
├── Schema Coverage: 95%
├── Breaking Changes: 2 detected
└── Test Coverage: 78%

Continuing API documentation...
```

## Practical Examples

**Generate API Documentation:**
```
/api-docs                        # Complete API documentation
/api-docs routes/api/            # Focus on specific API directory
/api-docs --format=openapi       # Generate OpenAPI specification
/api-docs --tests               # Generate API test suite
```

**Session Management:**
```
/api-docs resume        # Continue existing documentation
/api-docs generate      # Regenerate documentation
/api-docs validate      # Validate API specification
```

## Integration with Development Workflow

**API Development Workflow:**
- Integrate with CI/CD for automatic documentation updates
- Generate API documentation on code changes
- Validate API contracts against implementation
- Monitor API usage and performance metrics

**Command Suggestions:**
Based on findings, I may suggest:
- `/architecture-analysis` - For API architecture review
- `/security-scan` - For API security analysis
- `/monitoring-setup` - For API performance monitoring

## Safety Guarantees

**Protection Measures:**
- Non-destructive documentation generation
- Preserve existing documentation and customizations
- Version control integration for documentation changes
- Safe integration with existing API workflows

**Important:** I will NEVER:
- Modify API implementation code without explicit approval
- Overwrite custom documentation without backup
- Expose sensitive API information in documentation
- Add AI attribution to API documentation

## What I'll Actually Do

1. **Discover automatically** - Find all API endpoints and schemas
2. **Generate comprehensively** - Create complete OpenAPI specifications
3. **Document interactively** - Build interactive API exploration tools
4. **Test thoroughly** - Generate comprehensive API test suites
5. **Monitor continuously** - Track API changes and breaking changes
6. **Integrate seamlessly** - Work with existing development workflows

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of API documentation and specification progress.