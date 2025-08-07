# Docker Optimize

I'll analyze your Docker configurations and containerization strategy to optimize build times, image sizes, and security while ensuring deployment reliability.

Arguments: `$ARGUMENTS` - Dockerfile paths, container focus areas, or optimization targets

## Session Intelligence

I'll maintain Docker optimization progress across sessions:

**Session Files (in current project directory):**
- `docker-optimize/analysis.md` - Container optimization recommendations
- `docker-optimize/state.json` - Optimization progress and metrics

**IMPORTANT:** Session files are stored in a `docker-optimize` folder in your current project root

**Auto-Detection:**
- If session exists: Resume Docker optimization
- If no session: Create new container analysis
- Commands: `resume`, `build`, `security`

## Phase 1: Container Configuration Analysis

**MANDATORY FIRST STEPS:**
1. Check if `docker-optimize` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `docker-optimize/state.json`
   - Look for `docker-optimize/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Scan for Docker files and container configurations
   - Analyze current containerization strategy
   - Create optimization analysis plan
4. Show Docker optimization preview before execution

**Docker Configuration Detection:**
- Use **Glob** to find Dockerfiles, docker-compose files, and .dockerignore
- Use **Read** to analyze container configurations and build strategies
- Use **Grep** to identify optimization opportunities and security issues
- Analyze Kubernetes manifests and deployment configurations

## Phase 2: Dockerfile Efficiency Analysis

### Extended Thinking for Complex Container Scenarios

For complex containerization scenarios, I'll use extended thinking:

<think>
When optimizing complex container deployments:
- Multi-stage build optimization for different deployment targets
- Container orchestration and service mesh integration considerations
- Security hardening across different container runtime environments
- Performance optimization for high-throughput containerized applications
- Resource allocation and scaling strategies for container clusters
- Container registry optimization and image distribution strategies
- Cross-platform container compatibility and architecture considerations
</think>

**Triggers for Extended Analysis:**
- Multi-stage builds with complex dependency chains
- Microservices architecture with multiple containers
- High-security environments requiring container hardening
- Performance-critical applications with strict resource constraints

I'll analyze your Dockerfile for efficiency improvements:

**Build Optimization:**
- Layer caching optimization and build context analysis
- Multi-stage build implementation for smaller production images
- Dependency installation optimization and package manager efficiency
- Build argument usage and environment variable management

**Image Size Reduction:**
- Base image selection and minimal image recommendations
- Unnecessary file removal and cleanup strategies
- Package manager cache cleanup and temporary file management
- Static binary compilation and dependency reduction

## Phase 3: Container Security Scanning

I'll perform comprehensive security analysis:

**Security Vulnerability Detection:**
- Base image vulnerability scanning and update recommendations
- Package vulnerability analysis and remediation strategies
- Configuration security assessment and hardening recommendations
- Secret management and sensitive data exposure prevention

**Security Best Practices:**
- Non-root user implementation and privilege reduction
- File system permissions and access control optimization
- Network security and port exposure minimization
- Runtime security and container isolation enhancement

## Phase 4: Multi-Stage Build Optimization

I'll optimize multi-stage builds for efficiency:

**Build Stage Analysis:**
- Build stage dependency optimization and parallelization
- Artifact copying efficiency and layer optimization
- Development vs production stage separation
- Build tool and runtime environment optimization

**Production Image Optimization:**
- Minimal runtime environment configuration
- Security hardening for production deployments
- Performance optimization for container startup
- Resource usage optimization and monitoring

## Phase 5: Container Orchestration Integration

I'll optimize for container orchestration platforms:

**Kubernetes Optimization:**
- Resource requests and limits optimization
- Health check and readiness probe configuration
- ConfigMap and Secret integration best practices
- Service mesh integration and networking optimization

**Docker Compose Enhancement:**
- Service dependency management and startup ordering
- Volume mounting optimization and data persistence
- Network configuration and service communication
- Environment variable management and configuration

## Context Continuity

**Session Resume:**
When you return and run `/docker-optimize` or `/docker-optimize resume`:
- Load existing Docker analysis and optimization progress
- Show container improvements and remaining optimizations
- Continue optimization from last checkpoint
- Maintain all container metrics and recommendations

**Progress Example:**
```
RESUMING DOCKER OPTIMIZATION SESSION
├── Image Size: 1.2GB → 450MB (62% reduction)
├── Build Time: 8m → 3m (improved caching)
├── Security Issues: 12 → 2 (critical resolved)
└── Optimization Score: 85/100

Continuing container optimization...
```

## Practical Examples

**Start Docker Optimization:**
```
/docker-optimize                     # Complete container analysis
/docker-optimize Dockerfile         # Focus on specific Dockerfile
/docker-optimize --security         # Security-focused analysis
/docker-optimize --build            # Build optimization focus
```

**Session Management:**
```
/docker-optimize resume      # Continue existing optimization
/docker-optimize build       # Optimize build process
/docker-optimize security    # Focus on security hardening
```

## Integration with Development Workflow

**Container Development Workflow:**
- Integrate with CI/CD for automated container optimization
- Generate optimized Dockerfiles and build configurations
- Monitor container performance and resource usage
- Validate container security and compliance requirements

**Command Suggestions:**
Based on findings, I may suggest:
- `/security-scan` - For comprehensive security analysis
- `/monitoring-setup` - For container monitoring and observability
- `/architecture-analysis` - For containerization strategy review

## Safety Guarantees

**Protection Measures:**
- Non-destructive analysis with optional configuration generation
- Backup creation before applying container optimizations
- Comprehensive testing recommendations for container changes
- Safe integration with existing container workflows

**Important:** I will NEVER:
- Modify production container configurations without approval
- Remove security measures without proper alternatives
- Break existing container functionality during optimization
- Add AI attribution to Docker configurations

## What I'll Actually Do

1. **Analyze comprehensively** - Dockerfile efficiency, security, and best practices
2. **Optimize systematically** - Build times, image sizes, and resource usage
3. **Secure thoroughly** - Container hardening and vulnerability remediation
4. **Integrate seamlessly** - Orchestration platform optimization
5. **Monitor continuously** - Container performance and security metrics
6. **Deploy safely** - Production-ready container configurations

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of container analysis and optimization progress.