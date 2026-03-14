# agentic-sdlc

A multi-agent orchestration framework for Claude Code that brings structured software development lifecycle (SDLC) workflows to AI-assisted development. Choose your own frontend, backend, and database stack during installation — the CLI generates tailored agent configurations for any supported combination.

---

## Why This Exists

Claude Code is powerful, but without structure it tends toward single-agent, ad-hoc development. This framework introduces:

- **Role-based agents** that mirror a real development team (architect, devs, testers, PO, UX)
- **Orchestrated workflows** that coordinate agents through design → implement → test → deploy phases
- **Composable templates** that generate stack-specific agent configurations for any project
- **Quality gates** with feedback loops and escalation to prevent runaway iteration

The result: Claude Code operates more like a coordinated development team than a single assistant.

---

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and configured
- Node.js 18+ (for the scaffolding CLI)
- Git

---

## Installation

### Step 1: Install the Plugin

**Option A: Install from GitHub** (recommended — works for anyone):

From within a Claude Code session:

```
/plugin marketplace add syanix/agentic-sdlc
/plugin install agentic-sdlc --scope user
```

This installs globally — all projects get the 5 orchestration agents and 5 workflow commands.

**Option B: Development mode** (for plugin contributors):

```bash
claude --plugin-dir /path/to/agentic-sdlc
```

Loads the plugin from a local clone for the current session. Changes take effect on next session (or use `/reload-plugins`).

**Option C: Clone to plugins directory**:

```bash
git clone https://github.com/syanix/agentic-sdlc.git ~/.claude/plugins/agentic-sdlc
```

### Step 2: Scaffold Your Project

Navigate to your project directory and run the CLI. You choose your own stack combination — there are no fixed presets to be locked into.

#### Interactive Mode (recommended for first-time use)

```bash
cd ~/my-project
npx create-agentic-project
```

The wizard walks you through each choice:

```
🏗  Create Agentic Project
Configure your Claude Code agent stack.

? Backend framework:    › NestJS / Go (Gin/Echo) / Python (FastAPI) / .NET 10
? Frontend framework:   › Next.js (App Router) / Astro / React (Vite)
? Database hosting:     › Neon Postgres / Supabase Postgres / Fly.io Postgres (unmanaged)
? E2E testing framework:› Playwright / Cypress
? Agent preset:         › Full SDLC / Minimal / Prototype / Backend Only / Frontend Only
```

#### Non-Interactive Mode (CI/scripting)

Pass your choices as flags to skip the wizard entirely:

```bash
npx create-agentic-project \
  --frontend nextjs \
  --backend dotnet \
  --database flyio \
  --testing-e2e playwright \
  --preset full-sdlc
```

Only `--frontend` and `--backend` are required. Other flags have sensible defaults:
- `--database` defaults to Neon Postgres (or the only valid option for your backend)
- `--testing-e2e` defaults to Playwright
- `--preset` is inferred from your stack (full-sdlc for full-stack, backend-only/frontend-only when appropriate)

### Step 3: Start Working

Use the workflow commands in any Claude Code session:

```
/feature Add user authentication with OAuth2 and email/password
/review security src/auth/
/improve performance src/api/
/analyze architecture
/deploy staging
```

---

## Stack Combinations

You can mix and match any frontend, backend, and database from the supported options below. The CLI validates compatibility and generates the correct agent configuration for your combination.

### Available Choices

| Category | Options |
|----------|---------|
| **Frontend** | Next.js (App Router), Astro, React (Vite), None |
| **Backend API** | NestJS, Go (Gin/Echo), Python (FastAPI), .NET 10, None |
| **Database** | Neon Postgres, Supabase Postgres, Fly.io Postgres (unmanaged), None |
| **E2E Testing** | Playwright, Cypress, None |

### Example Combinations

Here are some common stack combinations you can create:

```bash
# Full-stack TypeScript: Next.js + NestJS + Neon
npx create-agentic-project \
  --frontend nextjs --backend nestjs --database neon

# .NET API with React frontend on Fly.io
npx create-agentic-project \
  --frontend react-vite --backend dotnet --database flyio

# Python FastAPI with Astro frontend on Supabase
npx create-agentic-project \
  --frontend astro --backend python --database supabase-db

# Go microservice with Next.js frontend
npx create-agentic-project \
  --frontend nextjs --backend go --database neon

# Backend-only Go API on Fly.io (no frontend)
npx create-agentic-project \
  --frontend none --backend go --database flyio

# Frontend-only React SPA (no backend)
npx create-agentic-project \
  --frontend react-vite --backend none
```

### What Gets Generated

Running the CLI produces a `.claude/` directory in your project:

```
your-project/
├── CLAUDE.md                          # Project conventions (stack-specific)
└── .claude/
    ├── settings.json                  # Claude Code settings (allowed commands, etc.)
    ├── agent-registry.md              # Agent capability map
    ├── agents/
    │   ├── be-dev.md                  # Backend developer (e.g. NestJS-specific)
    │   ├── fe-dev.md                  # Frontend developer (e.g. Next.js-specific)
    │   ├── be-tester.md               # Backend tester (e.g. Jest-specific)
    │   └── fe-tester.md               # Frontend/E2E tester (e.g. Playwright-specific)
    ├── commands/
    │   ├── create.md                  # Scaffold new components/modules
    │   ├── fix.md                     # Bug diagnosis and fixing
    │   ├── test.md                    # Test generation/improvement
    │   └── debug.md                   # Interactive debugging
    ├── skills/
    │   ├── backend-dev-guidelines/    # Stack-specific backend patterns
    │   └── frontend-dev-guidelines/   # Stack-specific frontend patterns
    └── hooks/
        ├── post-tool-use-tracker.sh   # Track tool usage patterns
        └── stop-build-check.sh        # Build validation on session end
```

Each agent file is composed from a base role template merged with stack-specific instructions. For example, `be-dev.md` for a NestJS project contains NestJS-specific patterns, while `be-dev.md` for a Go project contains Go idioms and conventions.

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

## User Guide

### Workflow Commands

These are available in every project once the plugin is installed:

| Command | What It Does | When To Use |
|---------|-------------|-------------|
| `/feature <desc>` | Full-stack feature implementation through phased workflow (design → implement → test) | Starting a new feature or user story |
| `/review [type]` | Code review — types: `standard`, `security`, `architecture`, `performance`, `full` | Before merging, after implementation |
| `/improve [type]` | Code improvement — types: `quality`, `performance`, `types`, `architecture`, `tests` | Tech debt reduction, optimisation |
| `/analyze [type]` | System analysis — types: `architecture`, `performance`, `security`, `quality`, `full` | Understanding system state, audits |
| `/deploy [env]` | Pre-deployment validation — envs: `staging`, `production`, `preview` | Before deploying to any environment |

### Working with Agents

The task orchestrator automatically routes work to the right specialist agent. You can also address agents directly:

```
# Let the orchestrator decide routing
/feature Add password reset flow

# Address a specific agent directly
Use @architect to design the API contract for the payments service
Use @be-dev to implement the user registration endpoint
Use @fe-tester to add E2E tests for the checkout flow
```

### Agent Roster

**Plugin Agents (universal — available in all projects):**

| Agent | Role |
|-------|------|
| `task-orchestrator` | Routes tasks to specialists, manages feedback loops and quality gates |
| `architect` | System design, ADRs, architecture reviews, API contracts |
| `po` | Product requirements, user stories, acceptance criteria, backlog |
| `code-refactorer` | Code quality, tech debt reduction, performance optimisation |
| `ux-designer` | UI/UX design, accessibility, micro-interactions, visual polish |

**Project Agents (stack-specific — generated per project):**

| Agent | Role |
|-------|------|
| `be-dev` | Backend implementation with stack-specific patterns |
| `fe-dev` | Frontend implementation with framework-specific patterns |
| `be-tester` | Backend unit/integration testing |
| `fe-tester` | Frontend component testing + E2E testing |

### Presets

Presets control which agents, commands, skills, and hooks are included in the generated project:

| Preset | Use Case | What's Included |
|--------|----------|-----------------|
| **Full SDLC** | Full-stack projects | All 4 agents, all commands, all skills, all hooks |
| **Minimal** | Getting started quickly | Core agents + essential commands, no hooks |
| **Prototype** | Rapid prototyping | Dev agents only, minimal commands |
| **Backend Only** | API services, microservices | Backend dev + tester, backend commands, all hooks |
| **Frontend Only** | SPAs, static sites | Frontend dev + tester, frontend commands, all hooks |

### Configuration Hierarchy

| Level | Location | Scope |
|-------|----------|-------|
| User | `~/.claude/CLAUDE.md`, `~/.claude/settings.json` | All projects — personal preferences |
| Plugin | `.claude-plugin/` (this repo) | All projects — shared agents/commands |
| Project | `.claude/` (generated) | One project — stack-specific config |

Project overrides plugin. Plugin overrides user defaults (for agents/commands).

See [docs/CONFIGURATION-HIERARCHY.md](docs/CONFIGURATION-HIERARCHY.md) for details.

### Customising After Generation

The generated `.claude/` directory is yours to modify:

- **CLAUDE.md** — Add project-specific conventions, architecture notes, coding standards
- **Agent files** — Tweak agent instructions, add domain knowledge
- **Skills** — Add or modify framework-specific guidelines
- **Commands** — Customise project-level workflow commands

Re-running `npx create-agentic-project` in a project with an existing `.claude/` directory will prompt before overwriting.

---

## CLI Reference

```
Usage: create-agentic-project [options]

Scaffold a Claude Code agentic project with tech-stack-specific agents

Options:
  --frontend <framework>   Frontend: nextjs, astro, react-vite, none
  --backend <framework>    Backend:  nestjs, go, python, dotnet, none
  --database <hosting>     Database: neon, supabase-db, flyio, none
  --testing-e2e <framework> E2E:    playwright, cypress, none
  --preset <preset>        Preset:  full-sdlc, minimal, prototype, backend-only, frontend-only
  --name <name>            Project name (defaults to directory name)
  --target <dir>           Target directory (defaults to current directory)
  -V, --version            Output version number
  -h, --help               Display help
```

### Flag Details

| Flag | Required | Default | Notes |
|------|----------|---------|-------|
| `--frontend` | Yes (with `--backend`) | — | Set to `none` for backend-only projects |
| `--backend` | Yes (with `--frontend`) | — | Set to `none` for frontend-only projects |
| `--database` | No | `neon` | Auto-selected based on backend if only one option is valid |
| `--testing-e2e` | No | `playwright` | E2E testing framework |
| `--preset` | No | Inferred | `full-sdlc` for full-stack, `backend-only`/`frontend-only` when appropriate |
| `--name` | No | Directory name | Sanitised for use in configuration |
| `--target` | No | Current directory | Where to write the `.claude/` directory |

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
3. Add the stack to `cli/presets.ts` (types, labels, mappings)
4. Test composition produces clean output
5. Submit a PR

### Reporting Issues

Open an issue on [GitHub](https://github.com/syanix/agentic-sdlc/issues) with:

- Your stack combination (frontend, backend, database, testing)
- Steps to reproduce
- Expected vs actual behaviour

---

## Licence

MIT — see [LICENSE](LICENSE).
