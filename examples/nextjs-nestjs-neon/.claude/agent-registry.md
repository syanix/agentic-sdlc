# Agent Registry

## Overview

This project uses a hybrid agent system:
- **Plugin agents** (from agentic-sdlc): Universal roles that apply across any tech stack
- **Project agents** (in .claude/agents/): Stack-specific roles tailored to this project's technologies

Plugin agents are installed via the agentic-sdlc plugin and are available globally.
Project agents are defined in this repository and are customised for the project's specific stack.

## Plugin Agents (Universal)

| Agent | Model | Role | Description |
|-------|-------|------|-------------|
| task-orchestrator | opus | Central routing and orchestration | Receives tasks, breaks them down, and delegates to specialist agents |
| architect | opus | System design and ADRs | Makes architectural decisions, creates Architecture Decision Records |
| po | opus | Product documentation | Writes user stories, acceptance criteria, and product specifications |
| code-refactorer | opus | Code quality improvements | Identifies and applies refactoring patterns to improve code quality |
| ux-designer | opus | UX/UI design | Designs user interfaces and user experience flows |

### Plugin Agent Details

**task-orchestrator**
- Entry point for all multi-step tasks
- Analyses task requirements and selects appropriate agents
- Coordinates work across multiple agents
- Validates outputs before marking tasks complete

**architect**
- Evaluates architectural trade-offs
- Creates and maintains ADRs in `docs/adr/`
- Reviews system design proposals
- Ensures consistency with existing architecture

**po**
- Maintains product backlog items
- Writes acceptance criteria in Given/When/Then format
- Prioritises features based on business value
- Ensures requirements are testable and measurable

**code-refactorer**
- Identifies code smells and anti-patterns
- Applies SOLID principles and design patterns
- Reduces duplication and improves readability
- Ensures refactorings preserve existing behaviour

**ux-designer**
- Creates component designs and interaction patterns
- Ensures accessibility compliance (WCAG 2.1 AA)
- Reviews UI implementations for consistency
- Maintains design system documentation

## Project Agents (Stack-Specific)

| Agent | Model | Stack | Role | Description |
|-------|-------|-------|------|-------------|
| be-dev | sonnet | NestJS + Prisma + Neon | Backend development | Implements backend features, APIs, and services |
| fe-dev | sonnet | Next.js (App Router) | Frontend development | Implements frontend components, pages, and state management |
| be-tester | sonnet | Jest + Supertest | Backend testing | Writes unit and integration tests for backend code |
| fe-tester | sonnet | Playwright | Frontend E2E testing | Writes component and end-to-end tests for frontend code |

### Project Agent Details

**be-dev**
- Implements API endpoints, services, and data models
- Follows NestJS best practices: modules, DI, guards, pipes, interceptors
- Handles Prisma migrations and Neon Postgres interactions
- Ensures proper error handling and validation via DTOs

**fe-dev**
- Implements UI components and page layouts
- Manages Server Components, Client Components, and Server Actions
- Follows Next.js App Router best practices and conventions
- Ensures responsive design and accessibility with Shadcn/ui and Tailwind CSS

**be-tester**
- Writes unit tests for services and utilities using Jest
- Writes integration tests for API endpoints using Supertest
- Maintains test fixtures and factories
- Ensures adequate test coverage for backend code

**fe-tester**
- Writes E2E tests for critical user journeys using Playwright
- Maintains Page Objects and test fixtures
- Runs visual regression and accessibility checks
- Ensures adequate test coverage for frontend code

## Orchestration Flow

```
User Request
    │
    ▼
task-orchestrator (opus)
    │
    ├── Architecture decisions ──► architect (opus)
    ├── Product requirements ───► po (opus)
    ├── Code quality tasks ─────► code-refactorer (opus)
    ├── UX/UI design tasks ─────► ux-designer (opus)
    ├── Backend implementation ─► be-dev (sonnet)
    ├── Frontend implementation ► fe-dev (sonnet)
    ├── Backend testing ────────► be-tester (sonnet)
    └── Frontend testing ───────► fe-tester (sonnet)
```

## Command-Agent Mapping

| Command | Primary Agent | Supporting Agents |
|---------|--------------|-------------------|
| /create | task-orchestrator | architect, be-dev, fe-dev |
| /fix | task-orchestrator | be-dev, fe-dev |
| /test | task-orchestrator | be-tester, fe-tester |
| /debug | task-orchestrator | be-dev, fe-dev |
| /refactor | code-refactorer | be-dev, fe-dev |
| /design | architect | — |
| /story | po | — |
