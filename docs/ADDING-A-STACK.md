# Adding a Stack

This guide walks through contributing a new tech stack to the agentic-sdlc template system. Whether it is a new backend framework, frontend library, testing tool, or database hosting platform, the process follows the same pattern.

---

## File Checklist

Every new stack requires files in one or more of these categories:

### Backend Stack

- [ ] `templates/agents/_stacks/backend/<stack>.md` — Framework patterns, project layout, conventions
- [ ] `templates/skills/backend-dev-guidelines/_stacks/<stack>/patterns.md` — Detailed patterns and architecture

### Frontend Stack

- [ ] `templates/agents/_stacks/frontend/<stack>.md` — Component patterns, routing, state management
- [ ] `templates/skills/frontend-dev-guidelines/_stacks/<stack>/patterns.md` — Detailed patterns and architecture

### Testing Stack

- [ ] `templates/agents/_stacks/testing/<stack>.md` — Test patterns, configuration, mocking, coverage

### Database Stack

- [ ] `templates/agents/_stacks/database/<stack>.md` — Hosting specifics, connection setup, migrations

### Optional

- [ ] `templates/presets/<preset>.json` — If the stack warrants a new preset combination
- [ ] Update `cli/prompts.ts` — Add the stack as a selection option in the wizard

---

## Template Format Requirements

### Agent Stack Templates (`_stacks/`)

Each stack template is a content fragment — **no frontmatter**. It gets injected into a base agent template via placeholder replacement.

**Target length**: 60–120 lines

**Structure**:

```markdown
## [Framework Name] Development

### Project Structure
[Standard directory layout for this framework]

### Core Patterns
[Key patterns, conventions, and idioms]

### Error Handling
[Framework-specific error handling approach]

### Testing Integration
[How tests work with this framework]

### Common Commands
[CLI commands for dev, build, test, lint]
```

### Skill Resource Templates

Skill resources provide deeper reference material that agents can consult on demand.

**Target length**: 80–150 lines

**Structure**:

```markdown
# [Framework] Patterns

## Architecture
[Layering, module organisation, dependency rules]

## Data Access
[ORM/query patterns, migrations, connection management]

## Authentication & Authorisation
[Framework-specific auth patterns]

## Performance
[Caching, query optimisation, resource management]

## Anti-Patterns
[Common mistakes specific to this framework]
```

---

## Placeholder Naming Conventions

Templates use `{{DOUBLE_BRACES}}` placeholders. The CLI scaffolder replaces these during generation.

| Placeholder | Where Used | Replaced With |
|-------------|-----------|---------------|
| `{{BACKEND_STACK_INSTRUCTIONS}}` | `_base/be-dev.md` | Content from `_stacks/backend/<stack>.md` |
| `{{FRONTEND_STACK_INSTRUCTIONS}}` | `_base/fe-dev.md` | Content from `_stacks/frontend/<stack>.md` |
| `{{TESTING_STACK_INSTRUCTIONS}}` | `_base/be-tester.md`, `_base/fe-tester.md` | Content from `_stacks/testing/<stack>.md` |
| `{{DATABASE_STACK_INSTRUCTIONS}}` | `_base/be-dev.md` | Content from `_stacks/database/<stack>.md` |

**Rules**:
- Use `UPPER_SNAKE_CASE` inside double braces
- Do not introduce new placeholder names without updating the CLI generator
- Stack template files must not contain placeholders themselves — they are leaf content

---

## Content Guidelines

### Use Australian English

Spell "organisation", "behaviour", "optimisation", "colour", "analyse", etc.

### Reference Existing Stacks

Before writing, read the existing P0 templates for tone and structure:

- `templates/agents/_stacks/backend/nestjs.md` (~115 lines)
- `templates/agents/_stacks/frontend/nextjs.md` (~115 lines)
- `templates/agents/_stacks/testing/jest.md` (~80 lines)
- `templates/agents/_stacks/database/neon.md` (~45 lines)

### Focus on Patterns, Not Tutorials

Stack templates tell Claude **how** to build with the framework — patterns, conventions, project layout, and idiomatic usage. They are not beginner tutorials.

### Be Opinionated

Choose a recommended approach rather than listing all options. For example:
- "Use the repository pattern for data access" rather than "You can use repository pattern, active record, or raw queries"
- State **why** a pattern is preferred when it is not obvious

---

## Testing the New Stack

### Manual Verification

1. Run the CLI scaffolder with your new stack selected:

```bash
npx create-agentic-project --backend <your-stack> --frontend nextjs --preset full-sdlc
```

2. Inspect the generated `.claude/agents/be-dev.md` (or relevant agent file)
3. Verify:
   - No `{{PLACEHOLDER}}` remnants in the output
   - Content reads naturally as a single cohesive document
   - Framework-specific instructions are accurate and actionable
   - Line count is reasonable (150–250 lines for a composed agent)

### Smoke Test

Open the generated project in Claude Code and verify:
- The agent is listed and accessible
- Asking the agent about framework patterns produces accurate guidance
- The skill resources are discoverable and relevant

---

## PR Checklist

When submitting a new stack, ensure:

- [ ] All required files from the file checklist are included
- [ ] Templates follow the format and length conventions
- [ ] Australian English is used throughout
- [ ] No placeholders remain in stack template files
- [ ] Existing P0 templates were referenced for style consistency
- [ ] The CLI wizard includes the new stack option (if applicable)
- [ ] Manual testing confirms clean composition
- [ ] The README stacks table is updated
