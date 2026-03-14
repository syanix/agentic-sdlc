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
| be-dev | sonnet | Supabase (Edge Functions + RLS) | Backend development | Implements database schema, RLS policies, Edge Functions, and service integrations |
| fe-dev | sonnet | Astro (Islands Architecture) | Frontend development | Implements Astro pages, layouts, interactive islands, and content collections |
| be-tester | sonnet | Vitest | Backend testing | Writes unit and integration tests for Supabase utilities and Edge Functions |
| fe-tester | sonnet | Playwright | Frontend E2E testing | Writes end-to-end tests for user journeys and visual regression checks |

### Project Agent Details

**be-dev**
- Designs database schema with RLS policies for fine-grained access control
- Implements Edge Functions (Deno) for webhooks, scheduled tasks, and server logic
- Manages Supabase Auth integration, storage policies, and realtime subscriptions
- Generates TypeScript types from the database schema

**fe-dev**
- Implements Astro pages and layouts with zero-JS-by-default
- Builds interactive islands using React or Svelte with appropriate hydration directives
- Manages file-based routing, content collections, and view transitions
- Ensures responsive design and accessibility with semantic HTML and Tailwind CSS

**be-tester**
- Writes unit tests for Supabase service wrappers and utility functions using Vitest
- Tests Edge Functions with mocked Supabase client responses
- Maintains test fixtures and factories for realistic test data
- Ensures adequate test coverage for backend logic

**fe-tester**
- Writes E2E tests for critical user journeys using Playwright
- Maintains Page Objects and test fixtures
- Runs visual regression and accessibility checks
- Ensures adequate test coverage for frontend interactions

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
