---
name: skill-developer
description: Use this skill when you need to create, modify, or review Claude Code skills. Covers skill structure, frontmatter, progressive disclosure, best practices, and activation patterns.
---

# Skill Developer — Meta-Skill

This skill guides you through creating effective Claude Code skills. A skill encapsulates domain knowledge, workflows, or guardrails that Claude can activate contextually.

## Skill Structure

Every skill lives in its own directory under `skills/`:

```
skills/
  my-skill/
    SKILL.md            # Main skill file (required)
    resources/          # Supporting references (optional)
      patterns.md
      examples.md
```

- **SKILL.md** — The primary file Claude reads when the skill is activated. Must contain frontmatter and the core instructions.
- **resources/** — Supplementary material for deep dives. Claude reads these only when it needs more detail, keeping the main file lean.

## Frontmatter Format

Every SKILL.md must start with YAML frontmatter:

```yaml
---
name: my-skill-name
description: Use this skill when [specific trigger condition]. It provides [what it offers].
---
```

| Field         | Purpose                                                        |
|---------------|----------------------------------------------------------------|
| `name`        | Unique identifier, kebab-case. Matches the directory name.     |
| `description` | Tells Claude **when** to activate the skill. Be specific.      |

### Writing Good Descriptions

The `description` field is the single most important line — it determines whether Claude activates the skill at the right time.

- **Do:** "Use this skill when creating database migrations for PostgreSQL."
- **Don't:** "Database migration skill." (too vague, Claude cannot determine when to use it)

## Progressive Disclosure

Keep SKILL.md **under 500 lines**. If you need more, use `resources/`.

### Main file (SKILL.md)
- Mission and scope.
- Core rules and constraints.
- Key workflows (step-by-step).
- Quick-reference tables.
- Pointers to resources for further detail.

### Resources directory
- Detailed reference material.
- Extended examples and patterns.
- Edge cases and troubleshooting.
- Integration guides.

Claude will read resources on demand — reference them explicitly:

```markdown
For detailed pattern examples, see `resources/patterns.md`.
```

## Best Practices

### Right Altitude
Write instructions at the right level of abstraction. Skills should tell Claude **what** to do and **why**, not micromanage every keystroke.

- **Too high:** "Write good code."
- **Too low:** "Type `const` then a space then the variable name..."
- **Right:** "Create a validation middleware that rejects malformed request bodies with a 400 status and descriptive error message."

### Combat Distributional Convergence
Claude tends toward the most common patterns from its training data. Skills should explicitly call out when you want something **different** from the default:

- Specify your preferred patterns when they diverge from mainstream conventions.
- Use concrete examples of the desired output.
- State anti-patterns explicitly: "Do NOT use X pattern. Instead use Y because..."

### Clarity Over Brevity
- Use tables for structured data.
- Use numbered lists for sequential workflows.
- Use bullet points for unordered requirements.
- Use code blocks for examples.
- Use headings to create scannable structure.

### Single Responsibility
Each skill should cover **one domain**. If a skill grows beyond 500 lines or covers multiple unrelated concerns, split it.

## Skill Activation Patterns

Skills activate based on the `description` field matching the user's intent. Common trigger patterns:

| Pattern     | Example Description                                                  |
|-------------|----------------------------------------------------------------------|
| **Keyword** | "Use when the user mentions database migrations..."                  |
| **Intent**  | "Use when the user wants to set up a new microservice..."            |
| **File**    | "Use when working with files matching `*.migration.ts`..."           |
| **Command** | "Use when the user runs /create migration..."                        |

## Creating a New Skill — Checklist

1. Create `skills/<skill-name>/SKILL.md` with frontmatter.
2. Write a precise `description` that targets the right activation context.
3. Define the mission and scope in the first section.
4. Add core rules, constraints, and workflows.
5. If content exceeds ~300 lines, extract detail into `resources/`.
6. Test activation by simulating the trigger condition.
7. Verify Claude follows the instructions without hallucinating extra steps.

For detailed pattern examples and integration strategies, see `resources/skill-patterns.md`.
