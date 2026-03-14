# Customisation

This guide covers how to adapt the agentic-sdlc system to your specific needs — from modifying agents to creating custom commands and skills.

---

## Adding or Modifying Agents

### Modifying an Existing Plugin Agent

Plugin agents live in `agents/*.md`. To modify one for all projects, edit it directly. Each agent file has:

- **Frontmatter** — `name`, `model`, `description`
- **System prompt** — The agent's instructions, responsibilities, and coordination rules

### Creating a Project-Specific Agent Override

To customise an agent for a single project, create a file with the same name in the project's `.claude/agents/` directory. Project agents take precedence over plugin agents.

```bash
# Override the architect agent for this project
cp agents/architect.md my-project/.claude/agents/architect.md
# Edit to add domain-specific architectural patterns
```

### Adding a New Agent

1. Create `agents/my-agent.md` (plugin-level) or `.claude/agents/my-agent.md` (project-level)
2. Define frontmatter:

```yaml
---
name: my-agent
model: sonnet  # or opus for complex reasoning
description: |
  One-line description of when this agent should be used.
---
```

3. Write the system prompt with: core responsibilities, quality standards, coordination triggers (which agents it works with)
4. Update the `task-orchestrator.md` routing table to include the new agent

---

## Creating Custom Commands

Commands are slash commands users invoke directly (e.g., `/feature`, `/review`).

### Plugin Commands

Plugin commands live in `commands/*.md` and are available across all projects.

### Project Commands

Project commands live in `.claude/commands/*.md` and are project-specific. The CLI scaffolder generates these from `templates/commands/`.

### Command File Format

```yaml
---
description: One-line description shown in /help
---

# /command-name — Title

[Instructions for what Claude should do when this command is invoked]
```

### Example: Custom `/migrate` Command

```yaml
---
description: Generate and run database migrations
---

# /migrate — Database Migration Workflow

1. Analyse the current schema against the codebase models
2. Generate a migration file using the project's migration tool
3. Run the migration against the development database
4. Verify the schema matches expectations
5. Update the seed data if needed
```

---

## Writing Project-Specific Skills

Skills provide domain knowledge that Claude activates contextually.

### Skill Structure

```
skills/
  my-skill/
    SKILL.md          # Main skill file (required)
    resources/        # Detailed references (optional)
      patterns.md
```

### Creating a New Skill

1. Create the directory: `skills/my-skill/`
2. Write `SKILL.md` with frontmatter:

```yaml
---
name: my-skill
description: Use when [specific trigger condition]. Provides [what it offers].
---
```

3. Keep the main file under 500 lines. Use `resources/` for deep content.
4. Test activation by describing the trigger scenario in conversation.

See `skills/skill-developer/SKILL.md` for comprehensive guidance on skill design.

---

## Adjusting Presets

Presets define which project-level components the CLI scaffolder generates. They live in `templates/presets/*.json`.

### Preset Format

```json
{
  "name": "My Custom Preset",
  "description": "What this preset is for",
  "agents": ["be-dev", "fe-dev", "be-tester", "fe-tester"],
  "commands": ["create", "fix", "test", "debug"],
  "skills": ["backend-dev-guidelines", "frontend-dev-guidelines"],
  "hooks": ["post-tool-use-tracker", "stop-build-check"]
}
```

### Available Presets

| Preset | Use Case |
|--------|----------|
| `full-sdlc` | All components — full team simulation |
| `minimal` | Core agents and commands only |
| `prototype` | Dev agents only, no testers or hooks |
| `backend-only` | Backend dev + tester, no frontend |
| `frontend-only` | Frontend dev + tester, no backend |

### Creating a Custom Preset

1. Copy an existing preset from `templates/presets/`
2. Adjust the component arrays
3. Save as `templates/presets/my-preset.json`
4. Use with the CLI: `npx create-agentic-project --preset my-preset`

---

## Override Patterns

The system supports layered overrides:

### Project Overrides Plugin

Any component defined at the project level (`.claude/`) takes precedence over the same-named component at the plugin level (`.claude-plugin/`).

| Component | Plugin Location | Project Override |
|-----------|----------------|-----------------|
| Agents | `agents/*.md` | `.claude/agents/*.md` |
| Commands | `commands/*.md` | `.claude/commands/*.md` |
| Skills | `skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` |
| Instructions | — | `.claude/CLAUDE.md` |

### When to Override

- **Agent override**: When a project needs domain-specific knowledge baked into an agent (e.g., an architect agent that understands your specific microservices topology)
- **Command override**: When a workflow needs project-specific steps (e.g., `/deploy` that includes your specific CI/CD pipeline)
- **Skill override**: When framework guidelines need project-specific adjustments

### When NOT to Override

- If the change benefits all projects → modify the plugin-level component instead
- If the change is temporary → use CLAUDE.md instructions rather than creating an override file
