# Best Practices

Compiled best practices for working effectively with Claude Code and the agentic-sdlc system. These draw from Anthropic's official guidance, real-world experience, and the design philosophy behind this plugin.

---

## Verification-First Development

> "If you only change one thing about how you work with Claude Code, make it this: always verify before claiming success."

The single highest-leverage practice is **running verification commands** (tests, builds, linters) before declaring work complete. Claude can confidently state code is correct when it is not. Verification catches this.

- Run tests after every implementation step, not just at the end
- Use `npm test`, `go test ./...`, `pytest`, or your project's equivalent
- Check build output — compiler errors are free bug detection
- Verify the application runs, not just that it compiles

---

## The Core Workflow: Explore → Plan → Code → Verify

### 1. Explore

Understand before acting. Read the relevant files, trace the execution path, check existing patterns.

- Use subagents for broad codebase exploration
- Read tests to understand expected behaviour
- Check git history for context on recent changes

### 2. Plan

Design the approach before writing code. For non-trivial work, write a plan.

- Break work into discrete steps with clear success criteria
- Identify dependencies between steps
- Consider what could go wrong and how to handle it
- Use the architect agent for system-level decisions

### 3. Code

Implement incrementally, following the plan.

- Write the simplest solution that meets requirements
- Follow existing project patterns and conventions
- Avoid over-engineering — solve the current problem, not hypothetical future ones

### 4. Verify

Confirm correctness with evidence, not assumptions.

- Run the full test suite
- Verify the build succeeds
- Check for regressions in adjacent functionality
- Review the diff before marking complete

---

## CLAUDE.md Best Practices

Your CLAUDE.md file is the single most important piece of configuration. It shapes every interaction.

### Keep It Concise

- **Under 200 lines** for the main file
- Use `@import` to pull in longer reference material
- Every line should earn its place — if Claude already does something by default, do not tell it to

### Be Specific and Actionable

```markdown
# Good
- Use camelCase for variables, PascalCase for types
- Run `npm test` before marking any task complete
- Prefer named exports over default exports

# Bad
- Follow best practices
- Write clean code
- Use standard conventions
```

### Structure for Scannability

Use headings, tables, and bullet points. Claude reads CLAUDE.md at the start of every session — make it fast to parse.

### Keep It Current

Stale instructions cause confusion. Update CLAUDE.md when conventions change. Remove rules that no longer apply.

---

## Context Management

Claude Code has a finite context window. Managing it well is the difference between productive sessions and ones that stall.

### Use Subagents for Isolation

Each subagent gets its own context window. Use them to:

- Explore large parts of the codebase without filling the main context
- Run independent analyses in parallel
- Isolate implementation work from orchestration decisions

### Scope Narrowly

When dispatching to an agent, provide only the context it needs:

- Specific file paths, not "look at the whole project"
- Clear task description with success criteria
- Relevant constraints and patterns to follow

### Watch for Context Exhaustion

- Long conversations accumulate context. Use `/compact` when the context is getting full.
- Avoid asking Claude to read entire directories when you only need specific files
- Prefer targeted searches (`Grep`, `Glob`) over broad exploration

---

## Hooks vs CLAUDE.md

Both hooks and CLAUDE.md influence Claude's behaviour, but they serve different purposes:

| Aspect | Hooks | CLAUDE.md |
|--------|-------|-----------|
| **Enforcement** | Deterministic — code runs, hard pass/fail | Advisory — Claude may deviate |
| **Use for** | Build checks, lint gates, format enforcement | Conventions, preferences, context |
| **Failure mode** | Blocks the action | Claude may forget or misapply |
| **Examples** | Run tests on stop, check build after edit | "Use Australian English", "Prefer named exports" |

### Rule of Thumb

- If it **must** happen every time → use a hook
- If it **should** happen but judgement is needed → use CLAUDE.md

### Hook Examples from This Plugin

- `SessionStart` hook injects agent context into every session (`hooks/session-start.sh`)
- `post-tool-use-tracker` tracks tool usage patterns (template hook)
- `stop-build-check` verifies builds before session completion (template hook)

---

## Subagents for Context Isolation

Subagents are not just for parallelism — they are a context management tool.

### When to Use Subagents

- **Exploration**: Searching a large codebase for patterns or implementations
- **Independent tasks**: Two or more tasks with no data dependency
- **Protecting main context**: Heavy analysis that would consume the main context window
- **Specialist work**: Delegating to a domain expert (architect, tester, etc.)

### When NOT to Use Subagents

- Simple, direct tasks (reading one file, running one command)
- Tasks that depend on the main conversation's accumulated context
- When the overhead of spawning and summarising outweighs the benefit

---

## CLI Tool Integration

Claude Code works best when it can use your project's CLI tools directly.

### Allowlist Project Tools

In `.claude/settings.json`, allowlist the commands Claude needs:

```json
{
  "permissions": {
    "allow": [
      "npm test",
      "npm run build",
      "npm run lint",
      "npm run db:migrate"
    ]
  }
}
```

### Prefer Project Commands

Tell Claude about your project's commands in CLAUDE.md so it uses them instead of guessing:

```markdown
## Development Commands
npm run dev         # Start dev server
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run lint        # Lint and format check
```

---

## Skill Design Best Practices

When creating skills for your project (see `skills/skill-developer/SKILL.md`):

### Keep Under 500 Lines

The main SKILL.md should be a concise reference. Use `resources/` for deep dives.

### Write at the Right Altitude

- **Too high**: "Write good tests" — too vague to act on
- **Too low**: "Type `describe()` then..." — too granular, wastes tokens
- **Right**: "Write integration tests that hit a real database. Use factories for test data. Assert on response shape, not exact values." — actionable, clear, leaves room for judgement

### Combat Distributional Convergence

Claude tends toward the most common patterns from its training data. Skills should call out when you want something different:

- Specify your preferred patterns explicitly
- Include concrete examples of desired output
- State anti-patterns: "Do NOT use X. Instead use Y because..."

### Write Precise Descriptions

The `description` field in frontmatter determines when Claude activates the skill. Be specific:

```yaml
# Good
description: Use when creating database migrations for PostgreSQL with Drizzle ORM

# Bad
description: Database migration skill
```

---

## Blog Insights — Working with Claude as a Thought Partner

### Treat Claude as a Collaborator

The most effective pattern is not "tell Claude exactly what to code" but rather:

1. **Share the problem** — Describe what you are trying to achieve and why
2. **Explore together** — Let Claude analyse the codebase and propose approaches
3. **Make design decisions** — You decide the approach; Claude implements it
4. **Verify together** — Review the output, run tests, iterate

### Design-Driven Development

For UI work, describe the **experience** you want, not the implementation:

- "Users should be able to filter and sort the table without page reload"
- Not: "Add a `useState` hook for filters and a `useMemo` for sorting"

### Staged Complexity

Start simple, then layer in complexity:

1. Get the basic feature working end-to-end
2. Add error handling and edge cases
3. Optimise performance
4. Polish the UX

This maps directly to the phased orchestration model: architect → dev → tester → refactorer.
