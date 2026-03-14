# Prompt Library

A curated collection of copy-paste-ready prompts for use with Claude and other AI coding assistants. Each prompt is designed around a specific development task, with placeholders you fill in to match your project context.

## How to Use

1. Browse the domain folders below to find a prompt that matches your task.
2. Copy the prompt content (everything below the frontmatter block).
3. Replace all `[PLACEHOLDERS]` with your project-specific values.
4. Paste into Claude (or your preferred AI assistant) and iterate.

You do not need any tooling or framework to use these prompts. They work as plain text in any AI chat interface.

## Frontmatter Reference

Each prompt file begins with a YAML frontmatter block:

```yaml
---
name: Human-readable prompt title
domain: Which folder/domain this belongs to
complexity: low | medium | high
works-with: [optional agent or command pairings]
---
```

| Field        | Purpose                                                                 |
|--------------|-------------------------------------------------------------------------|
| `name`       | Display name for the prompt                                             |
| `domain`     | The development domain (frontend, backend, devops, etc.)                |
| `complexity` | Rough effort estimate: low (~15 min), medium (~1 hr), high (~half day)  |
| `works-with` | Optional agentic-sdlc agents or commands that pair well with the prompt |

## Placeholder Convention

All placeholders use `[UPPER_SNAKE_CASE]` format:

- `[COMPONENT_NAME]` -- a specific value you must provide
- `[FRAMEWORK]` -- choose from your stack (React, Vue, Angular, Svelte, etc.)
- `[OPTIONAL: THING]` -- can be removed if not applicable

## Domain Index

The library is organised into nine domains. Each domain folder contains prompts for that area of development.

### frontend/
Prompts for UI development, components, layouts, and client-side concerns.

- **component-creation.md** -- Build a responsive, accessible UI component
- **page-layout.md** -- Create a full page layout (dashboard, landing, admin)
- **form-handling.md** -- Multi-step form with validation and error UX
- **state-management.md** -- Set up global and server state management
- **performance-audit.md** -- Core Web Vitals and bundle analysis
- **accessibility-review.md** -- WCAG 2.1 compliance review

### backend/
Prompts for API design, database work, and server-side logic.

### architecture/
Prompts for system design, service boundaries, and technical decision records.

### design/
Prompts for design systems, wireframes, and visual specifications.

### testing/
Prompts for test strategy, unit/integration/e2e test generation, and coverage.

### devops/
Prompts for CI/CD pipelines, infrastructure, and deployment automation.

### code-quality/
Prompts for refactoring, linting rules, code review checklists, and technical debt.

### product/
Prompts for user stories, acceptance criteria, and feature specifications.

### meta/
Prompts about prompting itself -- templates, prompt chains, and meta-patterns.

## Using with Agentic-SDLC Agents and Commands

Each prompt's `works-with` field lists agents and commands from the agentic-sdlc toolkit that complement the prompt. This is entirely optional -- the prompts work standalone.

If you do have agents and commands available:

- **Agents** (task-orchestrator, architect, po, code-refactorer, ux-designer) can be invoked before or after a prompt to add planning, review, or refinement steps.
- **Commands** (/feature, /review, /improve, /analyze, /deploy) can wrap prompt output into structured workflows.

Example workflow:

1. Use the `component-creation` prompt to generate a React component.
2. Run `/review` to get a structured code review of the output.
3. Invoke the `ux-designer` agent to refine the visual and interaction details.

The prompts and the agentic-sdlc tooling are independent layers -- use either or both as suits your workflow.

## Contributing

When adding a new prompt:

1. Place it in the correct domain folder.
2. Include the full frontmatter block.
3. Keep prompts between 40-80 lines.
4. Use Australian English (organisation, behaviour, optimisation, colour, etc.).
5. Include at least two variations and a tips section.
6. Ensure all placeholders follow the `[UPPER_SNAKE_CASE]` convention.

## Licence

Part of the agentic-coding-reference project. See the root README for licence details.
