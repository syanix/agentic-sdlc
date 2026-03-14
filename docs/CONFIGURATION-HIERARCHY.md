# Configuration Hierarchy

Claude Code configuration is split across two levels: **user level** (global, personal) and **project level** (per-project, shared with the team). Understanding which configuration belongs where is critical for a well-organised setup.

---

## User Level — `~/.claude/`

User-level configuration applies to **all projects** and reflects personal preferences, installed plugins, and global permissions.

| File / Directory | Purpose |
|------------------|---------|
| `~/.claude/CLAUDE.md` | Personal instructions (coding style prefs, output format, behaviour rules) |
| `~/.claude/settings.json` | Global permissions, tool allowlists, MCP server config |
| `~/.claude/plugins/` | Installed plugins (like this one: `agentic-sdlc`) |
| `~/.claude/keybindings.json` | Custom keyboard shortcuts |
| `~/.claude/projects/` | Per-project memory and auto-generated context |

### What belongs here

- **Personal preferences**: "Never auto-commit", "Use Australian English", "Keep responses concise"
- **Plugin installations**: Plugins you want available across all projects
- **MCP server connections**: Servers you use globally (context7, sequential-thinking)
- **Permission defaults**: Which tools are auto-approved vs require confirmation
- **Key bindings**: Custom shortcuts

### Example `~/.claude/CLAUDE.md`

```markdown
- Never auto-commit code
- Use Australian English as default
- Always warn about context remaining before starting a new task
- Never create summary documents unless specifically asked
```

---

## Project Level — `.claude/`

Project-level configuration applies to **one project** and is typically committed to source control so the whole team shares it.

| File / Directory | Purpose |
|------------------|---------|
| `.claude/CLAUDE.md` | Project instructions (stack, conventions, architecture) |
| `.claude/settings.json` | Project permissions, allowed tools, hook config |
| `.claude/agents/*.md` | Stack-specific agent definitions |
| `.claude/commands/*.md` | Project-specific slash commands |
| `.claude/skills/` | Project-specific skills and guidelines |
| `.claude/agent-registry.md` | Agent hierarchy and routing reference |

### What belongs here

- **Tech stack context**: Frameworks, languages, database, deployment target
- **Coding conventions**: Naming, file organisation, error handling patterns
- **Architecture decisions**: Design patterns, module boundaries, data flow
- **Development commands**: Build, test, lint, migrate commands
- **Agent configuration**: Stack-specific agents composed for this project's stack
- **Custom commands**: Project-specific workflows (`/create`, `/fix`, `/test`, `/debug`)

### Example `.claude/CLAUDE.md`

```markdown
# My Project

## Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Backend**: NestJS
- **Database**: Neon Postgres
- **Testing**: Jest + Playwright

## Development Commands
npm run dev       # Start dev server
npm test          # Run tests
npm run db:migrate # Run migrations
```

---

## Decision Matrix

Use this table to decide where a piece of configuration belongs:

| Configuration | User Level | Project Level | Rationale |
|--------------|:----------:|:-------------:|-----------|
| Coding style preferences | ✓ | | Personal to you, not the team |
| Tech stack definition | | ✓ | Shared by all contributors |
| Plugin installations | ✓ | | Personal tooling choice |
| Agent definitions | | ✓ | Stack-specific, shared with team |
| MCP server connections | ✓ | | Personal infrastructure |
| Slash commands | | ✓ | Project-specific workflows |
| Permission allowlists | Both | Both | User sets personal defaults; project can scope further |
| Skills / guidelines | | ✓ | Framework-specific knowledge for the project |
| Hooks | | ✓ | Project-specific automation |
| "Never auto-commit" | ✓ | | Personal workflow preference |
| "Use conventional commits" | | ✓ | Team convention |

---

## Precedence Rules

When both levels define the same setting, the resolution order is:

1. **Project `.claude/CLAUDE.md`** overrides user `~/.claude/CLAUDE.md` for project-specific instructions
2. **User `settings.json`** sets the baseline for permissions
3. **Project `settings.json`** can further scope permissions for the project
4. **Plugin agents** (from `.claude-plugin/`) are available globally
5. **Project agents** (from `.claude/agents/`) are project-specific and may shadow plugin agent names

### Override Pattern

If a project needs to override a plugin agent (e.g., provide a custom `architect` with domain-specific knowledge), create a file at `.claude/agents/architect.md` in the project. Project-level agents take precedence over plugin-level agents with the same name.

---

## MCP Server Permissions

MCP servers require **two separate configuration steps** to work without prompts:

### Step 1: Server Connection

The MCP server must be configured so Claude Code can connect to it. This is done via:
- User-level: `~/.claude/.mcp.json`
- Project-level: `.mcp.json` in the project root
- Plugin-level: `.mcp.json` in the plugin directory (auto-loaded when plugin is enabled)

### Step 2: Tool Allow-List Entry

Even with a connected server, every tool call will prompt for approval unless the server is added to the `permissions.allow` list in `settings.json`.

```json
{
  "permissions": {
    "allow": [
      "mcp__playwright",
      "mcp__context7",
      "mcp__shadcn"
    ]
  }
}
```

The prefix `mcp__<server-name>` matches **all tools** from that server. For example, `mcp__playwright` covers `mcp__playwright__browser_click`, `mcp__playwright__browser_navigate`, etc.

### Common Pitfall

If an MCP server is installed but every call still prompts for approval, the allow-list entry is missing. This is the most common cause of excessive permission prompts.

### Where Each Step Belongs

| Step | User Level | Project Level | Plugin Level |
|------|:----------:|:-------------:|:------------:|
| Server connection | ✓ (personal infra) | ✓ (shared servers) | ✓ (bundled) |
| Allow-list entry | ✓ (always) | ✓ (project scoping) | ✗ (cannot set) |

Plugins can bundle an MCP server connection but **cannot** add allow-list entries — the user must add those to their own `settings.json`.

---

## CLAUDE.md Best Practices

Whether user-level or project-level, keep your CLAUDE.md files:

- **Concise** — Under 200 lines. Use `@import` for larger reference material.
- **Actionable** — Focus on rules and conventions, not explanations.
- **Specific** — "Use `camelCase` for variables" not "Follow standard naming conventions".
- **Current** — Update when conventions change. Stale instructions cause confusion.
- **Structured** — Use headings, tables, and bullet points for scannability.
