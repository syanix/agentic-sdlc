# Plugin Integration

The agentic-sdlc plugin is designed to complement other Claude Code plugins, not replace them. This document maps how it fits alongside popular plugins and MCP servers.

---

## Complementarity Map

| Plugin / Skill | What It Provides | How agentic-sdlc Complements It |
|---------------|------------------|--------------------------------|
| **superpowers** | Brainstorming, systematic debugging, TDD, code review, plan execution, verification | agentic-sdlc provides the agent roster and SDLC commands that superpowers' workflows can dispatch to |
| **feature-dev** | Guided feature development with codebase exploration | agentic-sdlc's `/feature` command orchestrates the full lifecycle; feature-dev focuses on single-feature depth |
| **frontend-design** | High-quality UI generation, anti-generic-AI aesthetics | agentic-sdlc's `ux-designer` agent can reference frontend-design's philosophy and output |
| **context7** | Up-to-date library documentation via MCP | Agents can query context7 for current API docs during implementation |
| **shadcn** | Component registry browsing and installation | `fe-dev` and `ux-designer` agents use shadcn to discover and add UI components |
| **document-skills** | PDF, PPTX, DOCX, spreadsheet generation | `po` agent can leverage document skills for formal deliverables |

### How They Work Together

```
User Request
    │
    ├── superpowers:brainstorming  →  Explore intent
    ├── superpowers:writing-plans  →  Create implementation plan
    │
    ├── agentic-sdlc: /feature    →  Execute plan via agent orchestration
    │   ├── architect agent        →  Uses context7 for API docs
    │   ├── fe-dev agent           →  Uses shadcn for components
    │   ├── ux-designer agent      →  Uses frontend-design philosophy
    │   └── be-tester agent        →  Uses context7 for test framework docs
    │
    └── superpowers:verification   →  Verify the implementation
```

---

## Recommended MCP Servers

These MCP servers enhance agent capabilities:

| MCP Server | Purpose | Agents That Benefit |
|-----------|---------|---------------------|
| **context7** | Query up-to-date library documentation | All dev and tester agents |
| **playwright** | Browser automation for E2E testing and visual verification | fe-tester, ux-designer |
| **postgres** | Direct database querying for debugging and verification | be-dev, architect |
| **shadcn-ui** | Browse and install UI components from registries | fe-dev, ux-designer |
| **sequential-thinking** | Structured multi-step reasoning for complex decisions | architect, task-orchestrator |
| **chrome-devtools** | Browser inspection, performance profiling, screenshots | fe-dev, fe-tester |

### Configuration

MCP servers are configured at the user level in `~/.claude/settings.json` or via project-level `.mcp.json`. The agentic-sdlc plugin does not bundle MCP servers — install them separately based on your project needs.

---

## Name Collision Avoidance

When multiple plugins define agents, commands, or skills with the same name, Claude Code resolves conflicts using precedence rules.

### Potential Collisions

| Component | agentic-sdlc Name | Potential Conflict With |
|-----------|-------------------|------------------------|
| Agent | `code-refactorer` | `code-refactoring:code-reviewer` (different scope) |
| Agent | `architect` | `backend-development:backend-architect` (different scope) |
| Command | `/review` | `superpowers:requesting-code-review` (skill, not command) |
| Command | `/deploy` | `vercel:deploy` (different scope — vercel-specific) |

### Avoidance Strategy

1. **Unique naming**: Plugin agents use short, role-based names (`architect`, `po`, `code-refactorer`). These are intentionally generic — they are orchestration-level roles, not stack-specific.
2. **Namespace awareness**: If a collision occurs, use the fully qualified name: `agentic-sdlc:architect` vs `backend-development:backend-architect`.
3. **Project override**: Project-level agents (in `.claude/agents/`) always take precedence over plugin-level agents with the same name. Use this to customise behaviour per project.
4. **Command scoping**: agentic-sdlc commands (`/feature`, `/review`, `/improve`, `/analyze`, `/deploy`) are SDLC workflow commands. They differ in intent from similarly-named skills in other plugins.

---

## Plugin Loading Order

Claude Code loads plugins in the order they appear in the user's configuration. This affects precedence when names collide.

### Recommended Order

1. **superpowers** — Process skills (brainstorming, debugging, TDD) should load first so they govern how work is approached
2. **agentic-sdlc** — Orchestration agents and SDLC commands load next, providing the execution framework
3. **Stack-specific plugins** — Plugins like feature-dev, frontend-design, backend-development load after, providing deep domain knowledge
4. **Utility plugins** — Document skills, context7, and other utility plugins load last

### Why Order Matters

- Skills from earlier-loaded plugins are matched first when Claude determines which skill to activate
- Agents from later-loaded plugins can shadow earlier ones if names collide
- Commands follow the same precedence — last loaded wins on name collision

---

## Integration Checklist

When adding agentic-sdlc to a project that already uses other plugins:

- [ ] Check for agent name collisions with existing plugins
- [ ] Verify command names do not conflict with existing slash commands
- [ ] Install recommended MCP servers for your stack
- [ ] Configure plugin loading order in `~/.claude/settings.json`
- [ ] Test that `/feature` and other commands route to the correct agents
- [ ] Verify the session-start hook injects context without conflicting with other hooks
