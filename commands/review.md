---
description: Review code for quality, security, and standards compliance
---

# /review — Multi-Dimensional Code Review

Perform a structured code review using specialised agents. Select from multiple review types, each activating different agent combinations for thorough analysis.

## Usage

```
/review [type] [target]
```

- **type**: `standard` | `security` | `architecture` | `performance` | `full` (default: `standard`)
- **target**: File path, directory, or branch diff (default: staged/uncommitted changes)

## Review Types & Agent Routing

### Standard Review
**Agents**: Code Quality + Testing
- Code standards and style compliance
- Error handling and edge cases
- Test coverage and quality
- Naming conventions and readability
- Duplication and maintainability

### Security Audit
**Agents**: Code Quality + Architect
- Input validation and sanitisation
- Authentication and authorisation checks
- Data exposure and privacy risks
- Dependency vulnerabilities
- Secrets and configuration security
- Injection attack vectors (SQL, XSS, command injection)

### Architecture Review
**Agents**: Architect + Code Quality
- Component boundaries and coupling
- Dependency direction and layering
- Design pattern adherence
- Separation of concerns
- Scalability implications
- Breaking change assessment

### Performance Review
**Agents**: Backend Developer + Frontend Developer
- Query and data access efficiency
- Memory usage and leak potential
- Rendering and bundle size impact
- Caching opportunities
- Algorithmic complexity
- Concurrency and resource contention

### Full Review
**Agents**: ALL (parallel execution)
- Combines all review types above
- Cross-cutting concern analysis
- Holistic risk assessment

## Review Checklist Categories

Each review evaluates against these categories where applicable:

1. **Correctness**: Logic errors, off-by-one, null handling, race conditions
2. **Security**: Vulnerabilities, data exposure, access control
3. **Performance**: Efficiency, resource usage, scalability bottlenecks
4. **Maintainability**: Readability, complexity, documentation, test coverage
5. **Standards**: Coding conventions, project patterns, consistency
6. **Architecture**: Design alignment, coupling, cohesion, abstraction levels

## Execution Strategy

1. Identify the changeset (diff, files, or directory)
2. Route to appropriate agents based on review type
3. Execute agent reviews in parallel where possible
4. Consolidate findings with severity ratings
5. Present actionable recommendations

## Output Format

```
## Code Review: [Type]
### Scope: [target description]

#### Critical Issues (must fix)
- [FILE:LINE] [Category] Description and recommendation

#### Warnings (should fix)
- [FILE:LINE] [Category] Description and recommendation

#### Suggestions (nice to have)
- [FILE:LINE] [Category] Description and recommendation

#### Positive Observations
- [Notable good patterns or practices found]

### Summary
- Files reviewed: N
- Issues found: N critical, N warnings, N suggestions
- Overall assessment: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION
```
