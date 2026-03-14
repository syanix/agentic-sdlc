# agentic-sdlc

A multi-agent orchestration framework for Claude Code that brings structured software development lifecycle (SDLC) workflows to AI-assisted development. It provides universal agents, composable project templates, and workflow commands that coordinate specialist AI agents across the full development lifecycle.

---

## Why This Exists

Claude Code is powerful, but without structure it tends toward single-agent, ad-hoc development. This framework introduces:

- **Role-based agents** that mirror a real development team (architect, devs, testers, PO, UX)
- **Orchestrated workflows** that coordinate agents through design → implement → test → deploy phases
- **Composable templates** that generate stack-specific agent configurations for any project
- **Quality gates** with feedback loops and escalation to prevent runaway iteration

The result: Claude Code operates more like a coordinated development team than a single assistant.

---

## Quick Start

### 1. Install the Plugin

Clone this repository into your Claude Code plugins directory:

```bash
git clone https://github.com/yoh/agentic-coding-reference.git ~/.claude/plugins/agentic-sdlc
```

This gives you the 5 universal agents and 5 workflow commands in every project.

### 2. Scaffold a Project

Generate stack-specific agents and configuration for a new project:

```bash
npx create-agentic-project
```

The interactive wizard asks for your frontend, backend, database, and testing choices, then generates a complete `.claude/` directory tailored to your stack.

#### Non-Interactive Mode

```bash
npx create-agentic-project \
  --preset full-sdlc \
  --frontend nextjs \
  --backend nestjs \
  --database neon \
  --testing jest,playwright
```

### 3. Start Working

Use the workflow commands in any Claude Code session:

```
/feature Add user authentication with OAuth2 and email/password
/review security src/auth/
/improve performance src/api/
/analyze architecture
/deploy staging
```

---

## Architecture Overview

The system operates on two layers:

```
┌─────────────────────────────────────────────┐
│  Plugin Layer (universal, installed once)     │
│                                              │
│  agents/          5 orchestration agents     │
│  commands/        5 SDLC workflow commands   │
│  hooks/           Session context injection  │
│  skills/          Project docs, skill dev    │
└──────────────────────┬──────────────────────┘
                       │ orchestrates
┌──────────────────────▼──────────────────────┐
│  Project Layer (generated per project)       │
│                                              │
│  .claude/agents/   Stack-specific devs/tests │
│  .claude/commands/ Project workflows         │
│  .claude/skills/   Framework guidelines      │
│  .claude/CLAUDE.md Project conventions       │
└─────────────────────────────────────────────┘
```

Plugin agents **orchestrate** (route, plan, review). Project agents **implement** (write code, run tests).

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full design.

---

## Supported Stacks

### Frontend

| Framework | Template | Status |
|-----------|----------|--------|
| Next.js (App Router) | `templates/agents/_stacks/frontend/nextjs.md` | P0 — Complete |
| Astro | `templates/agents/_stacks/frontend/astro.md` | P1 |
| React (Vite) | `templates/agents/_stacks/frontend/react-vite.md` | P1 |

### Backend

| Framework | Template | Status |
|-----------|----------|--------|
| NestJS | `templates/agents/_stacks/backend/nestjs.md` | P0 — Complete |
| Go (Gin/Echo) | `templates/agents/_stacks/backend/go.md` | P1 |
| Python (FastAPI) | `templates/agents/_stacks/backend/python.md` | P1 |
| Supabase | `templates/agents/_stacks/backend/supabase.md` | P1 |
| .NET 10 | `templates/agents/_stacks/backend/dotnet.md` | P2 |
| Cloudflare Workers | `templates/agents/_stacks/backend/cloudflare.md` | P2 |

### Database

| Hosting | Template | Status |
|---------|----------|--------|
| Neon Postgres | `templates/agents/_stacks/database/neon.md` | P0 — Complete |
| Supabase Postgres | `templates/agents/_stacks/database/supabase-db.md` | P1 |
| Fly.io Postgres | `templates/agents/_stacks/database/flyio.md` | P1 |
| Cloudflare D1 | `templates/agents/_stacks/database/cloudflare-d1.md` | P2 |

### Testing

| Framework | Template | Status |
|-----------|----------|--------|
| Jest | `templates/agents/_stacks/testing/jest.md` | P0 — Complete |
| Playwright | `templates/agents/_stacks/testing/playwright.md` | P0 — Complete |
| Vitest | `templates/agents/_stacks/testing/vitest.md` | P1 |
| Go test | `templates/agents/_stacks/testing/go-test.md` | P1 |
| pytest | `templates/agents/_stacks/testing/pytest.md` | P1 |
| Cypress | `templates/agents/_stacks/testing/cypress.md` | P1 |
| xUnit | `templates/agents/_stacks/testing/xunit.md` | P2 |

---

## Agent Roster

### Plugin Agents (universal)

| Agent | Role | Model |
|-------|------|-------|
| `task-orchestrator` | Routes tasks to specialists, manages feedback loops and quality gates | opus |
| `architect` | System design, ADRs, architecture reviews, API contracts | opus |
| `po` | Product requirements, user stories, acceptance criteria, backlog | opus |
| `code-refactorer` | Code quality, tech debt reduction, performance optimisation | opus |
| `ux-designer` | UI/UX design, accessibility, micro-interactions, visual polish | opus |

### Project Agents (stack-specific, generated)

| Agent | Role | Generated From |
|-------|------|---------------|
| `be-dev` | Backend implementation | `_base/be-dev.md` + stack template |
| `fe-dev` | Frontend implementation | `_base/fe-dev.md` + stack template |
| `be-tester` | Backend testing | `_base/be-tester.md` + stack template |
| `fe-tester` | Frontend/E2E testing | `_base/fe-tester.md` + stack template |

---

## Command Reference

### Plugin Commands (universal)

| Command | Purpose | Agent Routing |
|---------|---------|--------------|
| `/feature <desc>` | Full-stack feature implementation | Phased: architect+po → devs → testers |
| `/review [type]` | Code review (standard, security, architecture, performance, full) | Parallel dispatch by type |
| `/improve [type]` | Code improvement (quality, performance, types, architecture, tests) | Sequential chain by type |
| `/analyze [type]` | System analysis (architecture, performance, security, quality, full) | Parallel dispatch by type |
| `/deploy [env]` | Pre-deployment validation (staging, production, preview) | All agents in parallel → verdict |

### Project Commands (generated)

| Command | Purpose |
|---------|---------|
| `/create` | Scaffold new components, modules, or resources |
| `/fix` | Diagnose and fix bugs or failing tests |
| `/test` | Generate or improve tests for a target |
| `/debug` | Start an interactive debugging session |

See [commands/ROUTING_MAP.md](commands/ROUTING_MAP.md) for the complete routing decision tree.

---

## Configuration Hierarchy

| Level | Location | Scope |
|-------|----------|-------|
| User | `~/.claude/CLAUDE.md`, `~/.claude/settings.json` | All projects — personal preferences |
| Plugin | `.claude-plugin/` (this repo) | All projects — shared agents/commands |
| Project | `.claude/` (generated) | One project — stack-specific config |

Project overrides plugin. Plugin overrides user defaults (for agents/commands).

See [docs/CONFIGURATION-HIERARCHY.md](docs/CONFIGURATION-HIERARCHY.md) for details.

---

## Presets

| Preset | Includes |
|--------|----------|
| **Full SDLC** | All agents, all commands, all hooks |
| **Minimal** | Core agents + commands, no hooks |
| **Prototype** | Dev agents only, minimal commands |
| **Backend Only** | Backend dev + tester, all hooks |
| **Frontend Only** | Frontend dev + tester, all hooks |

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Multi-agent orchestration design and composition model |
| [CONFIGURATION-HIERARCHY.md](docs/CONFIGURATION-HIERARCHY.md) | User vs project configuration guide |
| [FEEDBACK-LOOPS.md](docs/FEEDBACK-LOOPS.md) | Quality gates, escalation matrix, iteration limits |
| [PLUGIN-INTEGRATION.md](docs/PLUGIN-INTEGRATION.md) | Working with other Claude Code plugins and MCP servers |
| [BEST-PRACTICES.md](docs/BEST-PRACTICES.md) | Compiled best practices for effective Claude Code usage |
| [CUSTOMISATION.md](docs/CUSTOMISATION.md) | Adding agents, commands, skills, and presets |
| [ADDING-A-STACK.md](docs/ADDING-A-STACK.md) | Guide for contributing new tech stack templates |

---

## Contributing

### Adding a New Stack

See [docs/ADDING-A-STACK.md](docs/ADDING-A-STACK.md) for the complete guide. In short:

1. Create stack template(s) in `templates/agents/_stacks/`
2. Create corresponding skill resources in `templates/skills/`
3. Add the stack to the CLI wizard options
4. Test composition produces clean output
5. Submit a PR

### Reporting Issues

Open an issue on [GitHub](https://github.com/yoh/agentic-coding-reference/issues) with:

- Your stack combination (frontend, backend, database, testing)
- Steps to reproduce
- Expected vs actual behaviour

---

## Licence

MIT — see [LICENSE](LICENSE).
