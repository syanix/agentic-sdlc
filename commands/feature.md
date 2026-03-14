---
description: Implement features with orchestrated multi-agent workflow
---

# /feature — Full-Stack Feature Implementation

Orchestrate a complete feature implementation through a structured multi-agent workflow. This command coordinates design, implementation, quality assurance, and documentation phases with parallel agent execution for efficiency.

## Usage

```
/feature <description of the feature to implement>
```

## Execution Phases

### Phase 1: Design & Planning (Parallel)

Launch the following agents in parallel:

- **Architect Agent**: Analyse system architecture, define component boundaries, data flow, API contracts, and integration points. Produce a technical design document.
- **Product Owner Agent**: Define acceptance criteria, user stories, edge cases, and success metrics. Validate scope and prioritise requirements.

**Deliverables:**
- Technical design with component diagram
- Acceptance criteria and user stories
- API contract definitions (if applicable)
- Data model changes (if applicable)

### Phase 2: Implementation (Parallel)

Based on Phase 1 outputs, launch relevant agents in parallel:

- **Backend Developer Agent**: Implement server-side logic, API endpoints, data access layers, business rules, and validations.
- **Frontend Developer Agent**: Implement UI components, state management, API integration, and user interactions.
- **UX Designer Agent** (if UI changes required): Define component structure, accessibility requirements, responsive behaviour, and interaction patterns.

**Deliverables:**
- Server-side implementation with error handling
- Client-side implementation with state management
- Database migrations (if applicable)
- API integration layer

### Phase 3: Quality Assurance (Parallel)

- **Testing Agent**: Write unit tests, integration tests, and end-to-end test scenarios. Validate acceptance criteria coverage.
- **Code Quality Agent**: Review implementation for standards compliance, code smells, duplication, and maintainability.

**Deliverables:**
- Test suites with adequate coverage
- Code quality report with actionable findings
- Refactoring recommendations

### Phase 4: Optimisation & Documentation

- **DevOps Agent**: Validate deployment readiness, environment configuration, and infrastructure requirements.
- **Architect Agent**: Update system documentation, architecture decision records, and dependency maps.

**Deliverables:**
- Deployment notes and configuration changes
- Updated architecture documentation
- Performance baseline measurements

## Security Considerations

Every phase must consider:
- Input validation and sanitisation
- Authentication and authorisation boundaries
- Data exposure and privacy implications
- Dependency vulnerability assessment
- Secrets management and configuration security

## Execution Strategy

1. **Sequential phase gates**: Each phase must complete before the next begins
2. **Parallel within phases**: Agents within a phase execute concurrently
3. **Artefact passing**: Each phase's outputs feed into the next phase's inputs
4. **Checkpoint validation**: Review deliverables at each phase boundary before proceeding
5. **Rollback capability**: If a phase reveals design issues, return to the appropriate earlier phase

## Output Format

Present a structured summary after each phase:

```
## Phase [N]: [Name] — Complete
### Agent: [Role]
- Status: DONE
- Key decisions: [...]
- Artefacts: [...]
- Issues raised: [...]
```

Final output includes a consolidated implementation summary with all files changed, tests added, and remaining action items.
