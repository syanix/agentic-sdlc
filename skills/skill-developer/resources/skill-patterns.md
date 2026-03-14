# Skill Patterns Reference

Detailed reference for common skill patterns, activation strategies, and integration approaches.

## Common Skill Patterns

### 1. Domain Knowledge Skill

Encapsulates expertise in a specific technical domain. Claude uses this knowledge to make informed decisions without requiring the user to explain conventions each time.

**When to use:** The team follows specific conventions or uses technologies with non-obvious best practices.

**Structure:**
```markdown
---
name: domain-name
description: Use when working with [domain]. Provides conventions, patterns, and constraints.
---

# Domain Name

## Conventions
- [List domain-specific rules]

## Patterns
- [Preferred approaches with examples]

## Anti-Patterns
- [What to avoid and why]
```

**Examples:** Database conventions, API design standards, security policies, coding style guides.

---

### 2. Guardrail Skill

Prevents common mistakes by defining constraints and validation rules. Acts as an automated reviewer.

**When to use:** There are known pitfalls, compliance requirements, or quality gates that must be enforced.

**Structure:**
```markdown
---
name: guardrail-name
description: Use when [creating/modifying] [scope]. Enforces [constraints].
---

# Guardrail Name

## Rules (MUST follow)
1. [Non-negotiable constraint]
2. [Non-negotiable constraint]

## Warnings (SHOULD follow)
1. [Best practice with rationale]

## Validation Checklist
- [ ] [Check 1]
- [ ] [Check 2]
```

**Examples:** Security review checklist, accessibility requirements, performance budgets, data privacy rules.

---

### 3. Workflow Skill

Defines a multi-step process that Claude should follow. Ensures consistency and completeness for repeatable tasks.

**When to use:** A task has a defined sequence of steps that should be followed every time.

**Structure:**
```markdown
---
name: workflow-name
description: Use when [performing task]. Guides through [process] step by step.
---

# Workflow Name

## Prerequisites
- [What must be in place before starting]

## Steps
1. [Step with expected outcome]
2. [Step with expected outcome]
3. [Step with expected outcome]

## Verification
- [How to confirm success]
```

**Examples:** Feature implementation workflow, release process, migration procedure, onboarding checklist.

---

### 4. Meta Skill

A skill about skills — helps create, maintain, or improve other skills. The skill-developer skill itself is a meta skill.

**When to use:** You need to bootstrap new skills or improve existing ones.

**Structure:** Follows the same SKILL.md convention but focuses on skill creation and maintenance as its domain.

---

## Activation Strategies

### Keyword Activation

The simplest form. Claude activates the skill when specific terms appear in the conversation.

```yaml
description: Use when the user mentions "database migration", "schema change", or "alter table".
```

**Pros:** Easy to understand, predictable.
**Cons:** Can over-trigger on casual mentions; may miss paraphrased intent.

**Tips:**
- List multiple keyword variants to improve coverage.
- Use quotation marks around exact phrases.
- Include both technical and colloquial terms.

### Intent Activation

Claude infers the user's goal and matches it to the skill description.

```yaml
description: Use when the user wants to add a new API endpoint or modify an existing one.
```

**Pros:** Handles natural language variation well.
**Cons:** Less predictable; depends on Claude's interpretation.

**Tips:**
- Describe the **outcome** the user is seeking, not just the action.
- Include 2-3 example scenarios in the description if space allows.

### File-Based Activation

Triggered when the user is working with specific file types or paths.

```yaml
description: Use when working with files in the migrations/ directory or files ending in .migration.ts.
```

**Pros:** Very precise; minimal false positives.
**Cons:** Only works when file context is available.

**Tips:**
- Reference both directory paths and file extensions.
- Consider glob patterns for clarity.

### Command Activation

Activated by explicit slash commands.

```yaml
description: Use when the user runs /deploy or asks about deployment procedures.
```

**Pros:** Explicit, user-controlled.
**Cons:** User must know the command exists.

**Tips:**
- Combine with intent activation as a fallback.
- Document available commands in the session context.

---

## Integration with Agents and Commands

### Skills + Agents

Agents can reference skills to augment their capabilities. In an agent definition:

```markdown
## Available Skills
- **project-docs** — For maintaining TODO, BACKLOG, and CHANGELOG.
- **domain-conventions** — For project-specific coding standards.
```

The agent reads the skill when it encounters a relevant task, gaining domain knowledge without bloating the agent definition.

### Skills + Commands

Commands can invoke skills as part of their workflow:

```markdown
## /create migration

1. Activate the **database-conventions** skill.
2. Generate a migration file following the conventions.
3. Activate the **project-docs** skill to update TODO.md.
```

### Skill Composition

Skills can reference other skills for complex workflows:

```markdown
For documentation updates after completing this workflow, defer to the **project-docs** skill.
```

Avoid deep nesting — one level of skill-to-skill reference is ideal.

---

## Testing Skills

### Manual Testing

1. Start a fresh Claude Code session.
2. Provide a prompt that should trigger the skill.
3. Verify Claude activates the skill (check for skill-specific language in the response).
4. Verify Claude follows the skill's instructions correctly.
5. Test edge cases: ambiguous prompts, partial matches, unrelated prompts.

### Validation Checklist

- [ ] Frontmatter is valid YAML with `name` and `description`.
- [ ] Description clearly states **when** to activate.
- [ ] Main file is under 500 lines.
- [ ] Resources are referenced explicitly, not assumed.
- [ ] No project-specific details leak into general-purpose skills.
- [ ] Anti-patterns are stated with rationale.
- [ ] Examples use realistic but generic scenarios.
- [ ] Skill activates correctly for target prompts.
- [ ] Skill does **not** activate for unrelated prompts.

### Common Issues

| Issue                        | Cause                              | Fix                                      |
|------------------------------|------------------------------------|------------------------------------------|
| Skill never activates        | Description too narrow             | Broaden trigger conditions               |
| Skill activates too often    | Description too vague              | Add specificity, use keyword anchors     |
| Claude ignores instructions  | Instructions buried in prose       | Use headings, lists, and bold for rules  |
| Conflicting skills activate  | Overlapping descriptions           | Narrow scope, add exclusion clauses      |
| Output quality inconsistent  | Missing examples                   | Add concrete input/output examples       |
