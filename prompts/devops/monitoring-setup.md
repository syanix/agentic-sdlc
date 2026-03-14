---
name: Monitoring Setup
domain: devops
complexity: high
works-with: [architect agent, /deploy command]
---

# Monitoring & Observability Setup Prompt

## When to Use

Use this prompt when you need to design a monitoring and observability setup covering metrics, structured logging, alerting rules, and dashboards.

## The Prompt

```
Design a monitoring and observability setup for [APPLICATION_NAME].

## Monitoring Stack
[MONITORING_STACK]

## Key Metrics
[KEY_METRICS]

## Alert Channels
[ALERT_CHANNELS]

Provide a comprehensive observability configuration covering:

### Metrics
1. Application metrics (request rate, error rate, latency percentiles)
2. Business metrics (sign-ups, transactions, conversion rates)
3. Infrastructure metrics (CPU, memory, disk, network)
4. Custom metric definitions with naming conventions
5. Dashboard layouts for operational and business views

### Logging
1. Structured logging format (JSON with correlation IDs)
2. Log levels and when to use each
3. Sensitive data redaction rules
4. Log retention and rotation policy

### Alerting
1. Alert rules with thresholds and evaluation windows
2. Severity levels (critical, warning, informational)
3. Escalation paths and on-call routing
4. Runbook links for each critical alert
```

## Variations

### Application Metrics
Append to the base prompt:
```
Focus on application-level observability:
- RED metrics (Rate, Errors, Duration) for every service endpoint
- USE metrics (Utilisation, Saturation, Errors) for resources
- Distributed tracing with OpenTelemetry instrumentation
- Trace sampling strategy (head-based vs tail-based)
- Service dependency map derived from trace data
- SLI definitions aligned with user-facing behaviour
- SLO targets with error budget tracking and burn-rate alerts
```

### Infrastructure Monitoring
Append to the base prompt:
```
Focus on infrastructure-level monitoring:
- Container orchestration metrics (pod restarts, scheduling latency)
- Node-level resource utilisation and capacity planning thresholds
- Network monitoring (DNS resolution, inter-service latency)
- Storage I/O metrics and capacity forecasting
- Auto-scaling trigger metrics and cooldown configuration
- Cost attribution dashboards by team or service
```

### Log Aggregation
Append to the base prompt:
```
Focus on centralised log management:
- Log shipping architecture (agents, collectors, processors)
- Parsing and enrichment pipeline configuration
- Index management and lifecycle policies
- Search and analysis query examples for common investigations
- Cross-service log correlation using trace and request IDs
- Compliance and audit log separation with appropriate access controls
```

## Tips

- Define SLIs and SLOs before building dashboards — measure what matters to users
- Alert on symptoms (high error rate), not causes (high CPU) where possible
- Avoid alert fatigue: every alert must be actionable and require human intervention
- Use the four golden signals: latency, traffic, errors, and saturation
- Include runbook links in every alert notification — do not rely on tribal knowledge
- Pair with the /deploy command to integrate monitoring into deployment pipelines
- Review and prune alerts quarterly — stale alerts erode trust in the system
- Start with fewer, high-quality alerts rather than comprehensive but noisy coverage
