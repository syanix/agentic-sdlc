---
name: Explore Codebase
domain: meta
complexity: low
works-with: [task-orchestrator agent, /analyze command]
---

# Explore Codebase

## When to Use

Use this prompt when you are new to a codebase and need to systematically understand its architecture, conventions, and technology stack.

## The Prompt

Systematically explore the codebase at **[CODEBASE_PATH]** with a focus on
**[FOCUS_AREA]**.

Answer these questions:

[QUESTIONS_TO_ANSWER]

Follow this exploration strategy:

1. **Entry points** - Start with `package.json`, `Makefile`, `docker-compose.yml`,
   or equivalent build/run configuration. Identify the main entry point and
   available scripts/commands.

2. **Directory structure** - Map the top-level directory layout. Identify the
   organisational pattern (by feature, by layer, monorepo packages, etc.).

3. **Configuration** - Read config files (`.env.example`, `tsconfig.json`,
   `settings.py`, etc.) to understand the runtime environment, dependencies,
   and build pipeline.

4. **Tests** - Read test files before source files. Tests reveal intended
   behaviour, edge cases, and the public API surface better than
   implementation code.

5. **Key abstractions** - Identify core interfaces, base classes, and shared
   utilities. These reveal the architectural decisions and conventions.

6. **Data flow** - Trace a single request or user action from entry point
   through to data store and back. Document the layers it passes through.

Produce a structured summary with:

- Architecture overview (pattern, layers, key decisions)
- Technology stack with versions
- Directory map with purpose annotations
- Answers to [QUESTIONS_TO_ANSWER]
- Potential concerns or technical debt spotted during exploration

## Variations

### Architecture Overview

Focus on high-level architecture: what pattern is used (MVC, hexagonal,
microservices), how modules communicate, where state lives, and what the
deployment topology looks like. Produce a diagram-ready description.

### Dependency Mapping

Map internal and external dependencies. Identify circular dependencies,
tightly coupled modules, and packages that could be extracted. Assess
dependency freshness and known vulnerabilities.

### Find Specific Pattern

Search for a specific pattern, convention, or implementation approach
within the codebase. Examples: "how is authentication handled", "where
are database migrations defined", "how are feature flags managed".
Provide file paths and code references for each finding.

## Tips

- Read `README.md` and `CLAUDE.md` first - they often contain essential context
- Check git log for recent activity patterns and active contributors
- Look at CI/CD configuration to understand the deployment pipeline
- Grep for `TODO`, `FIXME`, `HACK` to find known issues quickly
- Read the most recently modified files to understand current work focus
- Look at `.gitignore` to understand what tooling and artefacts the project uses
- If the codebase is large, explore one vertical slice fully before broadening
