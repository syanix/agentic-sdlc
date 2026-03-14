# Implementation Plan

> **Status**: All phases complete. CLI scaffolder, templates, documentation, and examples are done.
> **Created**: 2026-03-14
> **Updated**: 2026-03-14
> **Strategy**: 5 parallel work streams that ran as independent Claude sessions.
>
> **Note**: Supabase (backend), Cloudflare Workers (backend), and Cloudflare D1 (database) were removed from CLI choices. The supported stack matrix is: Frontend (Next.js, Astro, React Vite), Backend (NestJS, Go, Python, .NET 10), Database (Neon, Supabase Postgres, Fly.io Postgres unmanaged).

---

## Completed Work (Phase 1A + 1B)

All plugin foundation and template foundation files are done:

- `.claude-plugin/plugin.json` — plugin manifest
- `agents/` — 5 universal agents (task-orchestrator, architect, po, code-refactorer, ux-designer)
- `commands/` — 5 universal commands + ROUTING_MAP (feature, review, improve, analyze, deploy)
- `hooks/` — hooks.json + session-start.sh
- `skills/` — project-docs, skill-developer (with resources/)
- `templates/agents/_base/` — 4 base role templates (be-dev, fe-dev, be-tester, fe-tester)
- `templates/agents/_stacks/` — P0 stacks (nestjs, nextjs, jest, playwright, neon)
- `templates/commands/` — 4 project commands (create, fix, test, debug)
- `templates/config/` — CLAUDE.md.template, settings.json.template, agent-registry.md.template
- `templates/hooks/` — post-tool-use-tracker.sh, stop-build-check.sh, package.json
- `templates/presets/` — 5 presets (full-sdlc, minimal, prototype, backend-only, frontend-only)
- `templates/skills/` — backend-dev-guidelines (base + nestjs), frontend-dev-guidelines (base + nextjs)

---

## Parallel Work Streams

The remaining work splits into **5 independent streams** with zero file overlap. Each can be a separate Claude session.

### Stream 1: CLI Scaffolder (Phase 2)

**Directory**: `cli/`
**Dependencies**: Reads from `templates/` (already complete)
**Estimated files**: 5 + package.json + tsconfig.json

#### Tasks

1. **`package.json`** (root) — npm package config with `bin` entry for `create-agentic-project`, dependencies: `@inquirer/prompts`, `chalk`, `fs-extra`, `commander`
2. **`tsconfig.json`** (root) — TypeScript config targeting ES2022, module NodeNext
3. **`cli/index.ts`** — Entry point, parses args with commander, runs wizard, calls generator
4. **`cli/prompts.ts`** — Interactive wizard using @inquirer/prompts:
   - Frontend framework: Next.js (App Router) | Astro | React (Vite) | None
   - Backend framework: NestJS | Go (Gin/Echo) | Python (FastAPI) | .NET 10 | Supabase | Cloudflare | None
   - Database hosting: Neon | Supabase | Fly.io | Cloudflare D1 (filtered by backend choice)
   - E2E testing: Playwright | Cypress | None
   - Agent preset: Full SDLC | Backend focus | Frontend focus | Minimal
5. **`cli/generator.ts`** — Core composition logic:
   - Reads base templates from `templates/agents/_base/`
   - Reads stack templates from `templates/agents/_stacks/`
   - Replaces `{{PLACEHOLDERS}}` with stack-specific content
   - Generates single clean agent files into target `.claude/agents/`
   - Copies commands, hooks, skills based on preset selection
   - Generates CLAUDE.md, settings.json, agent-registry.md from templates
6. **`cli/presets.ts`** — Preset definitions mapping preset names to included components and valid stack combinations
7. **`cli/utils.ts`** — Helper functions: file copying, placeholder replacement, path resolution

#### Instructions for this session

```
You are implementing the CLI scaffolder for the agentic-coding-reference project.

Working directory: /Users/yoh/www/agentic-coding-reference

Key design decisions:
- The CLI composes agent files by combining _base/ role definitions with _stacks/ tech instructions
- Template placeholders use {{DOUBLE_BRACES}} syntax
- The generator reads templates from the templates/ directory (already written)
- Output goes to the target project's .claude/ directory
- Use @inquirer/prompts for the wizard, commander for CLI args, chalk for styling
- Support --preset flag to skip wizard (e.g., npx create-agentic-project --preset minimal --backend nestjs --frontend nextjs)

Read the existing template files to understand the placeholder patterns:
- templates/agents/_base/*.md (contain {{BACKEND_STACK_INSTRUCTIONS}}, {{TESTING_STACK_INSTRUCTIONS}}, etc.)
- templates/agents/_stacks/**/*.md (the content that replaces those placeholders)
- templates/config/*.template (contain {{PROJECT_NAME}}, {{FRONTEND_FRAMEWORK}}, etc.)
- templates/presets/*.json (define which components to include)

Write all files. Do NOT commit.
```

---

### Stream 2: P1 + P2 Stack Templates (Phases 3 + 4)

**Directory**: `templates/agents/_stacks/` and `templates/skills/`
**Dependencies**: None (follows patterns established in P0 stacks)
**Estimated files**: ~25

#### Tasks — P1 Stacks

Reference existing P0 templates for format/style:
- `templates/agents/_stacks/backend/nestjs.md` (~115 lines, layered architecture patterns)
- `templates/agents/_stacks/frontend/nextjs.md` (~115 lines, framework-specific instructions)
- `templates/agents/_stacks/testing/jest.md` (~80 lines, testing patterns)
- `templates/agents/_stacks/database/neon.md` (~45 lines, hosting specifics)

**Backend stacks to create:**
1. `templates/agents/_stacks/backend/go.md` — Go patterns: Gin/Echo routers, middleware, sqlc/GORM, project layout (cmd/internal/pkg), error handling, context propagation, goroutines, testing with httptest
2. `templates/agents/_stacks/backend/python.md` — FastAPI/Django: Pydantic models, dependency injection, SQLAlchemy/Django ORM, async patterns, middleware, Alembic migrations, type hints
3. `templates/agents/_stacks/backend/supabase.md` — Supabase as backend: client SDK, Row Level Security, Edge Functions (Deno), Realtime subscriptions, Storage, Auth integration, database functions

**Frontend stacks to create:**
4. `templates/agents/_stacks/frontend/astro.md` — Astro: Islands architecture, content collections, integrations, partial hydration, view transitions, Astro.glob, component frameworks
5. `templates/agents/_stacks/frontend/react-vite.md` — React SPA with Vite: React Router, TanStack Query, Zustand/Jotai, lazy loading, HMR, environment config, proxy setup

**Testing stacks to create:**
6. `templates/agents/_stacks/testing/vitest.md` — Vitest: configuration, workspace setup, mocking, coverage, snapshot testing, component testing with Testing Library
7. `templates/agents/_stacks/testing/go-test.md` — Go testing: table-driven tests, testify, httptest, test fixtures, benchmarks, race detector, coverage
8. `templates/agents/_stacks/testing/pytest.md` — pytest: fixtures, parametrize, factories (factory_boy), httpx for API tests, conftest patterns, coverage
9. `templates/agents/_stacks/testing/cypress.md` — Cypress: custom commands, fixtures, intercepts, component testing, visual testing, CI config

**Database stacks to create:**
10. `templates/agents/_stacks/database/supabase-db.md` — Supabase Postgres: RLS policies, database functions, triggers, realtime, migrations with Supabase CLI
11. `templates/agents/_stacks/database/flyio.md` — Fly.io Postgres: replicas, connection strings, volume management, backups, scaling

#### Tasks — P2 Stacks

12. `templates/agents/_stacks/backend/dotnet.md` — .NET 10: minimal APIs, EF Core, dependency injection, middleware, configuration, health checks
13. `templates/agents/_stacks/backend/cloudflare.md` — Cloudflare Workers: D1 database, Hono framework, Drizzle ORM, KV/R2 storage, Durable Objects, Wrangler CLI
14. `templates/agents/_stacks/testing/xunit.md` — xUnit: fact/theory, fixtures, mocking with Moq/NSubstitute, integration testing with WebApplicationFactory
15. `templates/agents/_stacks/database/cloudflare-d1.md` — Cloudflare D1: SQLite-compatible, migrations, Drizzle integration, edge caching, batch operations

#### Tasks — Corresponding Skills

16. `templates/skills/backend-dev-guidelines/_stacks/go/patterns.md` — Go-specific backend patterns
17. `templates/skills/backend-dev-guidelines/_stacks/python/patterns.md` — Python-specific backend patterns
18. `templates/skills/backend-dev-guidelines/_stacks/supabase/patterns.md` — Supabase-specific patterns
19. `templates/skills/backend-dev-guidelines/_stacks/dotnet/patterns.md` — .NET-specific patterns
20. `templates/skills/backend-dev-guidelines/_stacks/cloudflare/patterns.md` — Cloudflare-specific patterns
21. `templates/skills/frontend-dev-guidelines/_stacks/astro/patterns.md` — Astro-specific patterns
22. `templates/skills/frontend-dev-guidelines/_stacks/react-vite/patterns.md` — React Vite-specific patterns

#### Instructions for this session

```
You are writing tech-stack template files for the agentic-coding-reference project.

Working directory: /Users/yoh/www/agentic-coding-reference

Read the existing P0 templates first to match their format and style:
- templates/agents/_stacks/backend/nestjs.md
- templates/agents/_stacks/frontend/nextjs.md
- templates/agents/_stacks/testing/jest.md
- templates/agents/_stacks/database/neon.md
- templates/skills/backend-dev-guidelines/_stacks/nestjs/architecture.md

Key conventions:
- Each stack file is ~60-120 lines of framework-specific instructions
- Content focuses on HOW to build with that framework (patterns, conventions, tools)
- No frontmatter — these are content fragments composed into agent files
- Use Australian English throughout (organisation, behaviour, optimisation, etc.)
- Skill resource files cover deeper patterns for that stack

Write ALL files listed above. Do NOT commit.
```

---

### Stream 3: Prompt Library (Phase 5)

**Directory**: `prompts/`
**Dependencies**: None
**Estimated files**: ~44

#### Tasks

Each prompt file follows this format:
```markdown
---
name: [Prompt Name]
domain: [frontend|backend|testing|architecture|devops|code-quality|product|design|meta]
complexity: [low|medium|high]
works-with: [relevant agents/commands]
---

# [Prompt Name]

## When to Use
[1-2 sentences]

## The Prompt
\```
[The actual prompt text with [PLACEHOLDERS] for user customisation]
\```

## Variations
- **[Variant Name]**: [Description]

## Tips
- [Practical tip]
```

**Files to create:**

1. `prompts/README.md` — How to use the prompt library, format guide, organisation by domain

**Frontend (6 files):**
2. `prompts/frontend/component-creation.md` — Build responsive components
3. `prompts/frontend/page-layout.md` — Dashboard/page layouts
4. `prompts/frontend/form-handling.md` — Multi-step forms with validation
5. `prompts/frontend/state-management.md` — Global state setup
6. `prompts/frontend/performance-audit.md` — Core Web Vitals analysis
7. `prompts/frontend/accessibility-review.md` — WCAG 2.1 compliance review

**Backend (6 files):**
8. `prompts/backend/api-endpoint.md` — RESTful endpoint creation
9. `prompts/backend/database-migration.md` — Schema migration design
10. `prompts/backend/auth-implementation.md` — JWT auth with refresh tokens
11. `prompts/backend/background-jobs.md` — Queue/job processing
12. `prompts/backend/error-handling.md` — Comprehensive error handling
13. `prompts/backend/api-versioning.md` — API versioning strategy

**Testing (5 files):**
14. `prompts/testing/unit-test-suite.md` — Unit test generation
15. `prompts/testing/integration-tests.md` — Integration tests with real DB
16. `prompts/testing/e2e-user-journey.md` — E2E user journey tests
17. `prompts/testing/test-data-factories.md` — Test data factories
18. `prompts/testing/snapshot-testing.md` — Snapshot test setup

**Architecture (5 files):**
19. `prompts/architecture/system-design.md` — System architecture design
20. `prompts/architecture/adr-creation.md` — Architecture Decision Records
21. `prompts/architecture/api-contract.md` — API contract design
22. `prompts/architecture/database-schema.md` — Database schema design
23. `prompts/architecture/monorepo-structure.md` — Monorepo organisation

**DevOps (4 files):**
24. `prompts/devops/ci-cd-pipeline.md` — CI/CD pipeline setup
25. `prompts/devops/dockerfile.md` — Multi-stage Dockerfile
26. `prompts/devops/monitoring-setup.md` — Monitoring configuration
27. `prompts/devops/deployment-checklist.md` — Pre-deployment checklist

**Code Quality (4 files):**
28. `prompts/code-quality/refactoring.md` — Module refactoring
29. `prompts/code-quality/code-review.md` — PR code review
30. `prompts/code-quality/performance-optimisation.md` — Function profiling
31. `prompts/code-quality/tech-debt-analysis.md` — Tech debt assessment

**Product (4 files):**
32. `prompts/product/user-story.md` — User story writing
33. `prompts/product/prd-creation.md` — PRD creation
34. `prompts/product/acceptance-criteria.md` — Acceptance criteria
35. `prompts/product/feature-specification.md` — Feature spec writing

**Design (4 files):**
36. `prompts/design/ux-audit.md` — UX flow audit
37. `prompts/design/design-system.md` — Design system creation
38. `prompts/design/responsive-design.md` — Responsive layout
39. `prompts/design/micro-interactions.md` — Micro-interaction design

**Meta (5 files):**
40. `prompts/meta/explore-codebase.md` — Codebase exploration
41. `prompts/meta/interview-me.md` — Feature interview
42. `prompts/meta/write-claude-md.md` — CLAUDE.md generation
43. `prompts/meta/create-skill.md` — Skill creation
44. `prompts/meta/debug-systematically.md` — Systematic debugging

#### Instructions for this session

```
You are writing the prompt library for the agentic-coding-reference project.

Working directory: /Users/yoh/www/agentic-coding-reference

Write all 44 files in the prompts/ directory. Each prompt should be:
- Practical and immediately usable (not theoretical)
- Have [PLACEHOLDERS] the user fills in
- Include 2-3 variations for different contexts
- Include 1-2 practical tips
- Use Australian English (organisation, behaviour, optimisation, etc.)
- Be 40-80 lines each (README can be longer)
- Reference relevant agents/commands from the agentic-sdlc plugin where applicable

The prompts should work standalone (paste into Claude) but also reference
the framework's agents/commands as optional enhancers.

Write ALL files. Do NOT commit.
```

---

### Stream 4: Documentation (Phase 6a)

**Directory**: `docs/`
**Dependencies**: Should read existing files for accurate references
**Estimated files**: 8 + README.md

#### Tasks

1. **`docs/ARCHITECTURE.md`** (~150-200 lines) — Multi-agent orchestration design:
   - Plugin vs project layer separation
   - Agent composition model (base + stack)
   - Orchestration flow diagram (Mermaid)
   - Feedback loop architecture
   - Context management strategy

2. **`docs/CONFIGURATION-HIERARCHY.md`** (~100-120 lines) — User vs project level config:
   - User level (~/.claude/) — preferences, permissions, plugins, MCP, global skills
   - Project level (.claude/) — instructions, agents, commands, hooks, skills, settings
   - Decision matrix: what goes where and why

3. **`docs/FEEDBACK-LOOPS.md`** (~100-120 lines) — Feedback loop & escalation:
   - Orchestrator feedback loop diagram
   - Escalation matrix (failure type × iteration)
   - Max 3 iterations policy
   - Human escalation protocol

4. **`docs/PLUGIN-INTEGRATION.md`** (~100-120 lines) — Working with other plugins:
   - Complementarity map (superpowers, context7, feature-dev, etc.)
   - MCP server recommendations
   - Name collision avoidance
   - Plugin loading order

5. **`docs/BEST-PRACTICES.md`** (~150-200 lines) — Compiled Anthropic best practices:
   - Verification-first development
   - Explore → Plan → Code → Commit workflow
   - CLAUDE.md best practices
   - Context management
   - Hooks vs CLAUDE.md (deterministic vs advisory)
   - Subagents for context isolation
   - CLI tool integration
   - Skill design best practices

6. **`docs/CUSTOMISATION.md`** (~80-100 lines) — How to customise:
   - Adding/modifying agents
   - Creating custom commands
   - Writing project-specific skills
   - Adjusting presets
   - Override patterns

7. **`docs/ADDING-A-STACK.md`** (~80-100 lines) — Guide for contributing new stacks:
   - File checklist (agent stack, testing stack, database stack, skill resources)
   - Template format requirements
   - Placeholder conventions
   - Testing the new stack
   - PR checklist

8. **`README.md`** (root, ~200-250 lines) — Main project README:
   - What this is and why
   - Quick start (plugin install + CLI usage)
   - Architecture overview
   - Supported stacks table
   - Configuration hierarchy summary
   - Links to all docs

#### Instructions for this session

```
You are writing documentation for the agentic-coding-reference project.

Working directory: /Users/yoh/www/agentic-coding-reference

Read existing files to ensure accurate cross-references:
- .claude-plugin/plugin.json (plugin name and metadata)
- agents/*.md (agent names and descriptions)
- commands/*.md (command names and purposes)
- templates/ directory structure
- hooks/ files

Key conventions:
- Use Australian English throughout
- Use Mermaid diagrams where helpful
- Reference actual file paths from the project
- Keep each doc focused and under 250 lines
- Include practical examples, not just theory

Write ALL 8 files. Do NOT commit.
```

---

### Stream 5: Examples (Phase 6b)

**Directory**: `examples/`
**Dependencies**: Should read templates to generate realistic composed output
**Estimated files**: ~16 (4 examples × ~4 files each)

#### Tasks

Each example is a complete `.claude/` directory showing what the CLI scaffolder would generate for a specific stack combination. Each example needs:
- `CLAUDE.md` — Filled template with real stack details
- `agents/be-dev.md` — Composed agent (base + stack merged)
- `agents/fe-dev.md` — Composed agent (base + stack merged)
- `agents/be-tester.md` — Composed agent (base + testing stack merged)
- `agents/fe-tester.md` — Composed agent (base + testing stack merged)
- `agent-registry.md` — Filled agent registry
- `settings.json` — Project settings

**Example 1: `examples/nextjs-nestjs-neon/.claude/`**
- Frontend: Next.js (App Router)
- Backend: NestJS
- Database: Neon Postgres
- Testing: Jest (backend) + Playwright (frontend)

**Example 2: `examples/astro-supabase/.claude/`**
- Frontend: Astro
- Backend: Supabase (direct)
- Database: Supabase Postgres
- Testing: Vitest (backend) + Playwright (frontend)

**Example 3: `examples/react-go-flyio/.claude/`**
- Frontend: React (Vite)
- Backend: Go (Gin)
- Database: Fly.io Postgres
- Testing: go test (backend) + Playwright (frontend)

**Example 4: `examples/nextjs-cloudflare-d1/.claude/`**
- Frontend: Next.js (App Router)
- Backend: Cloudflare Workers
- Database: Cloudflare D1
- Testing: Vitest (backend) + Playwright (frontend)

#### Instructions for this session

```
You are creating example output for the agentic-coding-reference CLI scaffolder.

Working directory: /Users/yoh/www/agentic-coding-reference

Each example shows what a generated .claude/ directory looks like for a specific
tech stack combination. The key task is COMPOSING base templates with stack templates
into single, clean agent files (no placeholders remaining).

Read the base templates and stack templates first:
- templates/agents/_base/*.md (role definitions with {{PLACEHOLDERS}})
- templates/agents/_stacks/**/*.md (stack-specific content)
- templates/config/*.template (config templates)

For each example, generate the composed output by:
1. Taking the base agent template
2. Replacing {{BACKEND_STACK_INSTRUCTIONS}} with the relevant backend stack content
3. Replacing {{FRONTEND_STACK_INSTRUCTIONS}} with the relevant frontend stack content
4. Replacing {{TESTING_STACK_INSTRUCTIONS}} with the relevant testing stack content
5. Filling in config templates with the stack-specific values

IMPORTANT: For stacks that don't have template files yet (P1/P2 stacks like Go, Astro,
Supabase, Cloudflare), write reasonable composed content based on your knowledge of
those frameworks. The examples should look like realistic, complete output.

Create all 4 example directories with their files. Do NOT commit.
```

---

## Stream Dependency Summary

```
Stream 1 (CLI)          — reads templates/ (done) → writes cli/, package.json, tsconfig.json
Stream 2 (P1+P2 Stacks) — reads existing stacks (done) → writes templates/agents/_stacks/, templates/skills/
Stream 3 (Prompts)       — fully independent → writes prompts/
Stream 4 (Docs)          — reads all existing files → writes docs/, README.md
Stream 5 (Examples)      — reads templates/ (done) + stacks from Stream 2 (nice-to-have, can use own knowledge)
```

```
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Stream 1    │  │  Stream 2    │  │  Stream 3    │
    │  CLI         │  │  P1+P2       │  │  Prompts     │
    │  Scaffolder  │  │  Stacks      │  │  Library     │
    └──────────────┘  └──────┬───────┘  └──────────────┘
                             │ (nice-to-have)
    ┌──────────────┐  ┌──────▼───────┐
    │  Stream 4    │  │  Stream 5    │
    │  Docs        │  │  Examples    │
    └──────────────┘  └──────────────┘
```

All 5 streams can run **fully in parallel**. Stream 5 benefits from Stream 2 being done first (for P1/P2 stack templates), but can work around it by writing framework content directly.

---

## Session Naming Suggestion

When opening sessions, use these names for clarity:
1. `agentic-cli` — Stream 1
2. `agentic-stacks` — Stream 2
3. `agentic-prompts` — Stream 3
4. `agentic-docs` — Stream 4
5. `agentic-examples` — Stream 5
