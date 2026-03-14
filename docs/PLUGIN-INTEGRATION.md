# Plugin Integration

The agentic-sdlc plugin provides a complete SDLC agent roster with built-in domain knowledge for backend architecture, API design, database patterns, performance, and security. It is designed to complement process and utility plugins, not compete with them.

---

## Recommended Plugin Ecosystem

### Core Plugins

| Plugin | Source | Role | Relationship to agentic-sdlc |
|--------|--------|------|------------------------------|
| **superpowers** | superpowers-marketplace | Process methodology (brainstorming, TDD, debugging, verification, code review) | Governs *how* work is approached; agentic-sdlc governs *who* does the work |
| **agentic-sdlc** | Local plugin | Agent roster, SDLC commands, domain skills | The execution framework |

### Complementary Plugins

| Plugin | Source | What It Provides | How agentic-sdlc Uses It |
|--------|--------|------------------|--------------------------|
| **frontend-design** | claude-plugins-official | High-quality UI generation, anti-generic aesthetics | `ux-designer` and `fe-dev` agents reference its design philosophy |
| **feature-dev** | claude-plugins-official | Guided single-feature development | Complements `/feature` command which orchestrates full lifecycle |
| **context7** | claude-plugins-official | Up-to-date library documentation via MCP | All agents query for current API docs |
| **document-skills** | anthropic-agent-skills | PDF, PPTX, DOCX, spreadsheet generation | `po` agent uses for formal deliverables |
| **plugin-dev** | claude-plugins-official | Plugin creation and validation | For extending the agentic-sdlc framework itself |
| **supabase** | claude-plugins-official | Supabase-specific development | Stack-specific, used when project uses Supabase |
| **stripe** | claude-plugins-official | Stripe payment integration | Stack-specific, used when project uses Stripe |
| **vercel** | claude-plugins-official | Vercel deployment | Stack-specific, used when project deploys to Vercel |
| **learning-output-style** | claude-plugins-official | Educational explanations alongside task execution | Output style preference |

### Disabled — Domain Knowledge Absorbed

The `claude-code-workflows` community plugins have been **disabled**. Their best domain knowledge (backend architecture, API design, database patterns, performance engineering, security, testing methodology) has been absorbed directly into agentic-sdlc's agents and skills. This eliminates name collisions, reduces plugin overhead, and provides a single coherent source of domain expertise.

Previously enabled plugins now disabled:
- `application-performance`, `backend-api-security`, `backend-development`, `database-design`, `full-stack-orchestration`
- `code-refactoring`, `dependency-management`, `team-collaboration`, `agent-orchestration`, `error-diagnostics`
- Plus 5 others that were already disabled

### How They Work Together

```
User Request
    │
    ├── superpowers:brainstorming  →  Explore intent
    ├── superpowers:writing-plans  →  Create implementation plan
    │
    ├── agentic-sdlc: /feature    →  Execute plan via agent orchestration
    │   ├── architect agent        →  Backend arch + DB design + API patterns (absorbed knowledge)
    │   ├── fe-dev agent           →  Uses shadcn + frontend-design philosophy
    │   ├── ux-designer agent      →  Uses frontend-design philosophy
    │   ├── be-tester agent        →  TDD methodology + test automation (absorbed knowledge)
    │   └── code-refactorer agent  →  Security scanning + static analysis (absorbed knowledge)
    │
    └── superpowers:verification   →  Verify the implementation
```

---

## Permission Setup

### MCP Two-Step Requirement

MCP tools need **both** a server connection AND an allow-list entry to work without prompts. See `docs/CONFIGURATION-HIERARCHY.md` § "MCP Server Permissions" for details.

### Recommended Allow-List Entries

Add these to `~/.claude/settings.json` under `permissions.allow`:

```json
{
  "permissions": {
    "allow": [
      "Read", "Write", "Edit",
      "Glob", "Grep",
      "WebFetch", "WebSearch",
      "mcp__playwright",
      "mcp__context7",
      "mcp__shadcn",
      "mcp__chrome-devtools",
      "mcp__sequential-thinking",
      "mcp__server-postgres"
    ]
  }
}
```

**Why each matters:**
- `Glob` / `Grep` — Used constantly for codebase navigation. Without these, every search prompts.
- `WebFetch` / `WebSearch` — Used by agents to look up documentation and references.
- `mcp__playwright` — Used by `fe-tester` for E2E testing and visual verification.
- Other MCP entries — Cover all tools from each server.

### What to Keep Denied

- `rm` commands — Require explicit approval for destructive operations
- `.env` / secrets / credentials — Blocked by deny list for security
- `sudo`, `eval`, `rm -rf` — Blocked for safety

---

## Recommended MCP Servers

| MCP Server | Purpose | Agents That Benefit |
|-----------|---------|---------------------|
| **context7** | Query up-to-date library documentation | All dev and tester agents |
| **playwright** | Browser automation for E2E testing and visual verification | fe-tester, ux-designer |
| **postgres** | Direct database querying for debugging and verification | be-dev, architect |
| **shadcn-ui** | Browse and install UI components from registries | fe-dev, ux-designer |
| **sequential-thinking** | Structured multi-step reasoning for complex decisions | architect, task-orchestrator |
| **chrome-devtools** | Browser inspection, performance profiling, screenshots | fe-dev, fe-tester |
| **gitmcp** | Access GitHub repository documentation as MCP resources | All agents (optional) |

### Configuration

MCP servers are configured at the user level in `~/.claude/.mcp.json` or via project-level `.mcp.json`. The agentic-sdlc plugin does not bundle MCP servers — install them separately based on your project needs.

---

## Name Collision Avoidance

With claude-code-workflows disabled, the primary collision risk is between agentic-sdlc and project-level overrides.

### Resolution Rules

1. **Project agents** (`.claude/agents/`) always take precedence over plugin agents with the same name
2. **Fully qualified names** resolve ambiguity: `agentic-sdlc:architect` vs `feature-dev:code-architect`
3. **Commands** from later-loaded plugins shadow earlier ones with the same name
4. **Skills** from earlier-loaded plugins are matched first

### Recommended Plugin Loading Order

1. **superpowers** — Process skills govern *how* work is approached
2. **agentic-sdlc** — Agent roster and SDLC commands provide the execution framework
3. **Official plugins** — Stack-specific and utility plugins extend capabilities
4. **Utility plugins** — Document skills and other tools load last

---

## Integration Checklist

When adding agentic-sdlc to a project:

- [ ] Install agentic-sdlc as a local plugin (see README)
- [ ] Add `Glob`, `Grep`, `WebFetch`, `WebSearch` to user permissions allow-list
- [ ] Add MCP server allow-list entries for any installed MCP servers
- [ ] Install recommended MCP servers for your stack
- [ ] Test that `/feature` and other commands route to the correct agents
- [ ] Verify the session-start hook injects context without conflicting with other hooks
- [ ] Disable any claude-code-workflows plugins to avoid name collisions
