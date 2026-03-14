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
| be-dev | sonnet | Go (Gin) + sqlc + Fly.io Postgres | Backend development | Implements API endpoints, services, and data access using Go and Gin |
| fe-dev | sonnet | React (Vite) + TypeScript | Frontend development | Implements React components, pages, and client-side state management |
| be-tester | sonnet | go test + testify | Backend testing | Writes unit and integration tests for Go backend code |
| fe-tester | sonnet | Playwright | Frontend E2E testing | Writes end-to-end tests for critical user journeys |

### Project Agent Details

**be-dev**
- Implements API endpoints, services, and repository layers in Go
- Follows standard Go project layout: cmd/, internal/, pkg/
- Uses Gin for HTTP routing, middleware, and request handling
- Manages sqlc queries and golang-migrate migrations against Fly.io Postgres
- Ensures proper error handling with wrapped errors and consistent JSON responses

**fe-dev**
- Implements React components and page layouts with Vite
- Manages client-side routing with React Router
- Uses TanStack Query for server state and Zustand for client state
- Ensures responsive design and accessibility with Tailwind CSS
- Configures Vite proxy for local API development against the Go backend

**be-tester**
- Writes table-driven unit tests for services and utility functions using go test
- Writes integration tests for Gin handlers using httptest
- Uses testify for assertions and testcontainers-go for database tests
- Runs tests with race detector and coverage profiling enabled
- Maintains test fixtures and factory helpers

**fe-tester**
- Writes E2E tests for critical user journeys using Playwright
- Maintains Page Objects and test fixtures with authentication state
- Runs visual regression and accessibility checks with @axe-core/playwright
- Configures multi-browser testing across Chromium, Firefox, and WebKit
- Captures traces and screenshots on test failure for debugging

## Orchestration Flow

```
User Request
    |
    v
task-orchestrator (opus)
    |
    +-- Architecture decisions ----> architect (opus)
    +-- Product requirements ------> po (opus)
    +-- Code quality tasks --------> code-refactorer (opus)
    +-- UX/UI design tasks --------> ux-designer (opus)
    +-- Backend implementation ----> be-dev (sonnet)
    +-- Frontend implementation ---> fe-dev (sonnet)
    +-- Backend testing -----------> be-tester (sonnet)
    +-- Frontend testing ----------> fe-tester (sonnet)
```

## Command-Agent Mapping

| Command | Primary Agent | Supporting Agents |
|---------|--------------|-------------------|
| /create | task-orchestrator | architect, be-dev, fe-dev |
| /fix | task-orchestrator | be-dev, fe-dev |
| /test | task-orchestrator | be-tester, fe-tester |
| /debug | task-orchestrator | be-dev, fe-dev |
| /refactor | code-refactorer | be-dev, fe-dev |
| /design | architect | -- |
| /story | po | -- |
