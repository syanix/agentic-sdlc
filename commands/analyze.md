---
description: Comprehensive system analysis and insights
---

# /analyze — System Analysis Suite

Perform comprehensive analysis of your codebase using parallel specialist agents. Each analysis type targets different aspects of system health, producing actionable insights and recommendations.

Note: This command uses Australian English throughout — "analyse", "optimise", "organisation", etc.

## Usage

```
/analyze [type] [target]
```

- **type**: `architecture` | `performance` | `security` | `quality` | `full` (default: `full`)
- **target**: Directory, module, or scope (default: entire project)

## Analysis Types & Agent Routing

### Architecture Review
**Agents**: Architect + Code Quality (parallel)
- Dependency graph and coupling analysis
- Layer violation detection
- Module cohesion assessment
- Circular dependency identification
- Design pattern usage and consistency
- Component boundary evaluation
- Scalability and extensibility assessment

### Performance Audit
**Agents**: Backend Developer + Frontend Developer (parallel)
- Database query analysis and N+1 detection
- API response time profiling
- Memory usage and leak potential
- Bundle size and loading performance
- Caching strategy effectiveness
- Resource contention and concurrency issues
- Algorithmic complexity hotspots

### Security Assessment
**Agents**: Architect + Code Quality (parallel)
- Authentication and authorisation flow analysis
- Input validation coverage
- Data exposure and privacy audit
- Dependency vulnerability scanning
- Configuration and secrets management
- Injection vector identification
- OWASP Top 10 alignment check

### Code Quality Analysis
**Agents**: Code Quality + Testing (parallel)
- Cyclomatic complexity measurement
- Code duplication detection
- Test coverage gap analysis
- Error handling consistency
- Naming convention adherence
- Documentation coverage
- Technical debt inventory

### Full System Audit
**Agents**: ALL (parallel execution)
- Combines all analysis types above
- Cross-cutting concern identification
- Risk prioritisation matrix
- Holistic health score

## Parallel Execution Strategy

For efficiency, agents within each analysis type run concurrently:

1. **Dispatch**: Launch all relevant agents simultaneously
2. **Collect**: Gather findings as each agent completes
3. **Correlate**: Identify overlapping or related issues across agents
4. **Synthesise**: Merge findings into a unified report
5. **Prioritise**: Rank issues by severity, impact, and effort

## Output Format

```
## System Analysis: [Type]
### Scope: [target description]
### Date: [timestamp]

#### Executive Summary
[2-3 sentence overview of system health]

#### Critical Findings
1. [Severity: HIGH] [Category] — Description and impact
   Recommendation: [actionable fix]

#### Warnings
1. [Severity: MEDIUM] [Category] — Description and impact
   Recommendation: [actionable fix]

#### Observations
1. [Severity: LOW] [Category] — Description
   Suggestion: [optional improvement]

#### Positive Patterns
- [Good practices and patterns identified]

#### Metrics Summary
| Metric                | Value   | Status  |
|-----------------------|---------|---------|
| [metric name]         | [value] | OK/WARN |

#### Recommended Action Plan
1. [Immediate] — [action]
2. [Short-term] — [action]
3. [Long-term] — [action]
```
