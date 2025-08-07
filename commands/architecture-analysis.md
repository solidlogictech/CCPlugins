# Architecture Analysis

I'll analyze your codebase architecture, identify patterns and anti-patterns, assess technical debt, and provide recommendations for structural improvements and scalability.

Arguments: `$ARGUMENTS` - analysis scope, architecture focus, or specific pattern analysis

## Session Intelligence

I'll maintain architecture analysis progress across sessions:

**Session Files (in current project directory):**
- `architecture-analysis/report.md` - Architecture assessment and recommendations
- `architecture-analysis/state.json` - Analysis progress and findings tracking

**IMPORTANT:** Session files are stored in an `architecture-analysis` folder in your current project root

**Auto-Detection:**
- If session exists: Resume architecture analysis
- If no session: Create new architectural assessment
- Commands: `resume`, `patterns`, `refactor`

## Phase 1: Initial Setup & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `architecture-analysis` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `architecture-analysis/state.json`
   - Look for `architecture-analysis/report.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze project structure and architectural patterns
   - Detect frameworks, design patterns, and architectural decisions
   - Initialize technical debt and complexity assessment
4. Show architecture analysis preview before deep analysis

**Architecture Context Analysis:**
- Use **Glob** to find source files, configuration files, and architectural documentation
- Use **Read** to analyze code structure, dependencies, and design patterns
- Use **Grep** to identify architectural patterns, anti-patterns, and code smells
- Analyze project organization, module boundaries, and separation of concerns

## Phase 2: Architectural Pattern Detection

### Extended Thinking for Complex Architecture Scenarios

For complex architectural analysis scenarios, I'll use extended thinking:

<think>
When analyzing complex software architectures:
- Microservices architecture with service boundaries and communication patterns
- Event-driven architecture with message flows and eventual consistency
- Domain-driven design with bounded contexts and aggregate boundaries
- Layered architecture with proper separation of concerns and dependency inversion
- Hexagonal architecture with ports and adapters for external integrations
- CQRS and Event Sourcing patterns with read/write model separation
- Distributed system architecture with consistency, availability, and partition tolerance trade-offs
</think>

**Triggers for Extended Analysis:**
- Large codebases with complex module interdependencies
- Microservices or distributed system architectures
- Legacy system modernization requirements
- High-performance or scalability-critical applications
- Domain-complex applications requiring sophisticated modeling

I'll identify and analyze architectural patterns:

**Design Pattern Analysis:**
- **Creational Patterns**: Factory, Builder, Singleton usage and appropriateness
- **Structural Patterns**: Adapter, Decorator, Facade implementation quality
- **Behavioral Patterns**: Observer, Strategy, Command pattern effectiveness
- **Architectural Patterns**: MVC, MVP, MVVM, Clean Architecture adherence
- **Enterprise Patterns**: Repository, Unit of Work, Domain Model patterns

**Anti-Pattern Detection:**
- **God Object**: Overly complex classes with too many responsibilities
- **Spaghetti Code**: Tangled control flow and unclear program structure
- **Copy-Paste Programming**: Code duplication and maintenance issues
- **Magic Numbers**: Hardcoded values without clear meaning
- **Tight Coupling**: Excessive dependencies between modules

## Phase 3: Dependency Analysis

I'll analyze module dependencies and coupling:

**Dependency Mapping:**
- Module dependency graph generation and visualization
- Circular dependency detection and resolution strategies
- Dependency inversion principle adherence assessment
- Interface segregation and single responsibility analysis
- Coupling and cohesion metrics calculation

**Architecture Layering:**
- Layer separation and responsibility analysis
- Cross-cutting concern identification and management
- Dependency direction validation (high-level to low-level)
- Infrastructure dependency isolation assessment
- Domain logic purity and business rule encapsulation

## Phase 4: Code Quality and Technical Debt

I'll assess code quality and identify technical debt:

**Code Complexity Analysis:**
- Cyclomatic complexity measurement and hotspot identification
- Cognitive complexity assessment for maintainability
- Code duplication detection and refactoring opportunities
- Method and class size analysis with recommendations
- Nesting depth and readability improvement suggestions

**Technical Debt Assessment:**
- Code smell identification and prioritization
- Refactoring opportunity analysis and impact assessment
- Legacy code modernization recommendations
- Performance bottleneck identification in architectural choices
- Security vulnerability assessment in architectural decisions

## Phase 5: Scalability and Performance Analysis

I'll analyze architectural scalability and performance characteristics:

**Scalability Assessment:**
- Horizontal vs. vertical scaling capability analysis
- Bottleneck identification in architectural components
- Caching strategy analysis and optimization opportunities
- Database design and query performance architectural impact
- Load balancing and distribution strategy assessment

**Performance Architecture:**
- Request flow analysis and optimization opportunities
- Memory usage patterns and optimization strategies
- I/O operation efficiency and asynchronous processing analysis
- Resource utilization and capacity planning recommendations
- Performance monitoring and observability architecture

## Phase 6: Security Architecture Review

I'll analyze security aspects of the architecture:

**Security Pattern Analysis:**
- Authentication and authorization architecture assessment
- Data flow security and encryption strategy analysis
- Input validation and sanitization architectural patterns
- Security boundary identification and enforcement
- Threat modeling and attack surface analysis

**Security Best Practices:**
- Principle of least privilege implementation
- Defense in depth strategy assessment
- Secure communication patterns and protocols
- Data protection and privacy compliance architecture
- Security monitoring and incident response integration

## Context Continuity

**Session Resume:**
When you return and run `/architecture-analysis` or `/architecture-analysis resume`:
- Load existing architecture analysis and assessment progress
- Show recent code changes and architectural impact
- Continue analysis from last checkpoint
- Maintain all pattern detection and recommendation tracking

**Progress Example:**
```
RESUMING ARCHITECTURE ANALYSIS SESSION
├── Modules Analyzed: 45/52 (↑7 new modules)
├── Patterns Detected: 23 (12 good, 11 anti-patterns)
├── Technical Debt: High priority items: 8
└── Dependency Issues: 3 circular dependencies found

Continuing architecture analysis...
```

## Practical Examples

**Start Architecture Analysis:**
```
/architecture-analysis                    # Complete architectural assessment
/architecture-analysis --patterns       # Focus on design pattern analysis
/architecture-analysis src/core/        # Analyze specific module
/architecture-analysis --debt           # Technical debt assessment
```

**Session Management:**
```
/architecture-analysis resume     # Continue existing analysis
/architecture-analysis patterns   # Focus on pattern detection
/architecture-analysis refactor   # Generate refactoring recommendations
```

## Integration with Development Workflow

**Architecture Governance:**
- Architectural decision record (ADR) generation and tracking
- Code review integration with architectural guidelines
- Continuous architecture validation in CI/CD pipelines
- Team training and architectural knowledge sharing

**Command Suggestions:**
Based on findings, I may suggest:
- `/refactor` - For implementing architectural improvements
- `/database-optimize` - For database architecture optimization
- `/monitoring-setup` - For architectural observability

## Safety Guarantees

**Protection Measures:**
- Non-destructive analysis with recommendation generation only
- Existing code preservation during analysis
- Safe refactoring recommendations with impact assessment
- Gradual improvement strategies with minimal risk

**Important:** I will NEVER:
- Modify code without explicit approval and understanding
- Recommend changes that could break existing functionality
- Remove architectural patterns without suitable replacements
- Add AI attribution to architectural documentation

## What I'll Actually Do

1. **Analyze comprehensively** - Code structure, patterns, and architectural decisions
2. **Identify intelligently** - Patterns, anti-patterns, and improvement opportunities
3. **Assess thoroughly** - Technical debt, scalability, and maintainability
4. **Recommend strategically** - Prioritized improvements with clear benefits
5. **Document clearly** - Architectural findings and improvement roadmap
6. **Guide effectively** - Provide actionable steps for architectural evolution

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of architectural analysis and improvement progress.