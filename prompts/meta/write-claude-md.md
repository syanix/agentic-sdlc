---
name: Write CLAUDE.md
domain: meta
complexity: medium
works-with: [architect agent, /analyze command]
---

# Write CLAUDE.md

## When to Use

Use this prompt when setting up or improving a project's CLAUDE.md file to give Claude Code the context it needs to work effectively in the codebase.

## The Prompt

Generate a `CLAUDE.md` file for the project at **[PROJECT_PATH]**.

### Tech Stack

[TECH_STACK]

### Team Conventions

[TEAM_CONVENTIONS]

Analyse the codebase and produce a `CLAUDE.md` that covers:

1. **Project overview** (2-3 sentences) - What it does, who it serves, core tech.
2. **Build and run commands** - Install, dev server, test, build, lint, format.
3. **Architecture summary** - Key directories, organisational pattern, important
   patterns to follow.
4. **Code conventions** - Naming, file structure, import ordering, error handling.
   Reference [TEAM_CONVENTIONS] and existing linter/formatter configuration.
5. **Testing expectations** - What to test, how, coverage requirements, naming.
6. **Common pitfalls** - Quirks, workarounds, non-obvious decisions.

Keep the file under 150 lines. Every line should be actionable. Focus on what
is specific to this codebase. Use imperative mood ("Run `npm test`").

## Variations

### New Project CLAUDE.md

The project is being set up from scratch. Generate a CLAUDE.md based on
[TECH_STACK] and [TEAM_CONVENTIONS] with sections pre-filled where possible
and `TODO` markers where codebase analysis is needed later. Include a
reminder to update the file as the project evolves.

### Improve Existing CLAUDE.md

Read the existing `CLAUDE.md` at [PROJECT_PATH] and improve it. Cross-reference
against the actual codebase to find outdated commands, missing conventions,
or undocumented patterns. Suggest additions and flag any instructions that
contradict the codebase.

### Monorepo Root + Package-Level

Generate a root-level `CLAUDE.md` covering the monorepo structure, shared
tooling, and cross-package conventions. Then generate a package-level
`CLAUDE.md` template for individual packages that covers package-specific
build commands, dependencies, and testing. Explain how package-level files
complement rather than duplicate the root file.

## Tips

- Keep it concise - developers skim, they do not read walls of text
- Include actual commands, not descriptions of commands
- Test every command you document - stale instructions erode trust
- Put the most frequently needed information at the top
- Use code blocks for all commands and file paths
- Update `CLAUDE.md` as part of the PR process when conventions change
- Do not duplicate information that lives in `README.md` - reference it
- Add a "last verified" date so staleness is visible
