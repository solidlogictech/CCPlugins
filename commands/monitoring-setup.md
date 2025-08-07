# Monitoring Setup

I'll configure comprehensive observability for your application with logging, metrics, tracing, and alerting to ensure production reliability and performance visibility.

Arguments: `$ARGUMENTS` - monitoring platform, service focus, or observability scope

## Session Intelligence

I'll maintain monitoring setup progress across sessions:

**Session Files (in current project directory):**
- `monitoring-setup/configuration.md` - Monitoring setup plan
- `monitoring-setup/state.json` - Implementation progress

**IMPORTANT:** Session files are stored in a `monitoring-setup` folder in your current project root

**Auto-Detection:**
- If session exists: Resume monitoring setup
- If no session: Create new observability plan
- Commands: `resume`, `metrics`, `alerts`

## Phase 1: Observability Strategy Analysis

**MANDATORY FIRST STEPS:**
1. Check if `monitoring-setup` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `monitoring-setup/state.json`
   - Look for `monitoring-setup/configuration.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze application architecture and monitoring needs
   - Identify existing monitoring infrastructure
   - Create comprehensive observability plan
4. Show monitoring setup preview before implementation

**Application Analysis:**
- Use **Glob** to find application entry points and service definitions
- Use **Read** to analyze application architecture and dependencies
- Use **Grep** to identify existing logging and monitoring patterns
- Analyze deployment configuration and infrastructure setup

## Phase 2: Logging Infrastructure Setup

### Extended Thinking for Complex Monitoring Scenarios

For complex monitoring scenarios, I'll use extended thinking:

<think>
When setting up comprehensive observability:
- Distributed tracing across microservices and service mesh architectures
- High-cardinality metrics collection and storage optimization strategies
- Log aggregation and correlation across multiple services and environments
- Real-time alerting and incident response automation workflows
- Performance monitoring and SLA/SLO tracking for business-critical services
- Security monitoring and threat detection integration
- Cost optimization for monitoring infrastructure and data retention
</think>

**Triggers for Extended Analysis:**
- Microservices architecture requiring distributed tracing
- High-traffic applications needing performance monitoring
- Security-critical systems requiring threat detection
- Multi-environment deployments with complex infrastructure

I'll set up comprehensive logging infrastructure:

**Structured Logging:**
- Application logging configuration with structured formats
- Log level management and contextual information inclusion
- Error tracking and exception monitoring integration
- Request/response logging and correlation ID implementation

**Log Aggregation:**
- **ELK Stack**: Elasticsearch, Logstash, and Kibana setup
- **Fluentd/Fluent Bit**: Log collection and forwarding configuration
- **Grafana Loki**: Lightweight log aggregation and querying
- **Cloud Solutions**: AWS CloudWatch, Google Cloud Logging, Azure Monitor

## Phase 3: Metrics Collection and Monitoring

I'll implement comprehensive metrics collection:

**Application Metrics:**
- Business metrics and KPI tracking implementation
- Performance metrics (response times, throughput, error rates)
- Resource utilization monitoring (CPU, memory, disk, network)
- Custom metrics for application-specific monitoring needs

**Infrastructure Metrics:**
- **Prometheus**: Metrics collection and storage setup
- **Grafana**: Dashboard creation and visualization configuration
- **StatsD/InfluxDB**: Time-series metrics collection and storage
- **APM Tools**: New Relic, DataDog, or Dynatrace integration

## Phase 4: Distributed Tracing Implementation

I'll set up distributed tracing for request flow visibility:

**Tracing Infrastructure:**
- **Jaeger**: Distributed tracing system setup and configuration
- **Zipkin**: Request tracing and performance analysis
- **OpenTelemetry**: Vendor-neutral observability framework
- **Cloud Tracing**: AWS X-Ray, Google Cloud Trace integration

**Trace Instrumentation:**
- Automatic instrumentation for popular frameworks
- Custom span creation for business-critical operations
- Trace sampling and performance optimization
- Cross-service correlation and dependency mapping

## Phase 5: Alerting and Incident Response

I'll configure intelligent alerting and response systems:

**Alert Configuration:**
- SLI/SLO-based alerting for service reliability
- Threshold-based alerts for performance and error metrics
- Anomaly detection and machine learning-based alerting
- Alert routing and escalation policy configuration

**Incident Response:**
- **PagerDuty**: Incident management and on-call scheduling
- **Slack/Teams**: Alert notification and team communication
- **Webhook Integration**: Custom alert handling and automation
- **Runbook Automation**: Automated incident response procedures

## Phase 6: Health Checks and Uptime Monitoring

I'll implement comprehensive health monitoring:

**Health Check Endpoints:**
- Application health check implementation
- Dependency health validation (database, external APIs)
- Readiness and liveness probe configuration
- Custom health check logic for business requirements

**Uptime Monitoring:**
- **Synthetic Monitoring**: Automated user journey testing
- **External Monitoring**: Third-party uptime monitoring services
- **Multi-region Monitoring**: Global availability verification
- **Performance Monitoring**: Real user monitoring (RUM) setup

## Context Continuity

**Session Resume:**
When you return and run `/monitoring-setup` or `/monitoring-setup resume`:
- Load existing monitoring configuration and implementation progress
- Show setup status and remaining configuration tasks
- Continue setup from last checkpoint
- Maintain all monitoring configuration and credentials

**Progress Example:**
```
RESUMING MONITORING SETUP SESSION
├── Logging: ✓ Configured (ELK Stack)
├── Metrics: ✓ Prometheus + Grafana
├── Tracing: ⏳ Jaeger setup in progress
├── Alerts: ⏳ 8 of 12 alerts configured
└── Health Checks: ✓ All endpoints implemented

Continuing monitoring setup...
```

## Practical Examples

**Start Monitoring Setup:**
```
/monitoring-setup                    # Complete observability setup
/monitoring-setup --platform=datadog # Use specific monitoring platform
/monitoring-setup metrics/          # Focus on metrics collection
/monitoring-setup --alerts          # Configure alerting system
```

**Session Management:**
```
/monitoring-setup resume     # Continue existing setup
/monitoring-setup metrics    # Configure metrics collection
/monitoring-setup alerts     # Set up alerting system
```

## Integration with Development Workflow

**Monitoring Development Workflow:**
- Integrate monitoring setup with CI/CD pipelines
- Generate monitoring configuration as code
- Validate monitoring coverage during deployment
- Monitor application performance and reliability metrics

**Command Suggestions:**
Based on setup requirements, I may suggest:
- `/docker-optimize` - For container monitoring optimization
- `/performance-audit` - For application performance baseline
- `/security-scan` - For security monitoring integration

## Safety Guarantees

**Protection Measures:**
- Non-destructive monitoring setup with optional integration
- Secure credential management and access control
- Comprehensive testing of monitoring configurations
- Safe integration with existing infrastructure

**Important:** I will NEVER:
- Expose sensitive application data in monitoring systems
- Configure monitoring without proper access controls
- Modify production systems without approval
- Add AI attribution to monitoring configurations

## What I'll Actually Do

1. **Plan comprehensively** - Complete observability strategy and architecture
2. **Configure systematically** - Logging, metrics, tracing, and alerting setup
3. **Integrate seamlessly** - Work with existing infrastructure and workflows
4. **Monitor effectively** - Ensure comprehensive coverage and visibility
5. **Alert intelligently** - Configure meaningful alerts and incident response
6. **Optimize continuously** - Monitor performance and cost optimization

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of monitoring setup and configuration progress.