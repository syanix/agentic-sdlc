---
name: Monorepo Structure
domain: architecture
complexity: medium
works-with: [architect agent, /analyze command]
---

# Monorepo Structure Prompt

## When to Use

Use this prompt when you need to design or restructure a monorepo, defining package boundaries, build pipelines, and developer workflows.

## The Prompt

```
Design a monorepo structure for [PROJECT_NAME].

## Packages / Applications
[PACKAGES]

## Build Tool
[BUILD_TOOL]

## Shared Libraries
[SHARED_LIBRARIES]

Provide:
1. Complete directory tree with descriptions for each top-level folder
2. Package naming conventions and scope strategy
3. Dependency graph showing relationships between packages
4. Build configuration with task pipelines and caching rules
5. Shared configuration files (TypeScript, ESLint, Prettier, etc.)
6. CI/CD considerations for selective builds and deployments
7. Developer workflow for common tasks (adding a package, running tests, etc.)

Ensure clear dependency boundaries — no circular dependencies.
```

## Variations

### Turborepo Setup
Append to the base prompt:
```
Configure using Turborepo with:
- turbo.json pipeline definitions with proper input/output hashing
- Remote caching setup (Vercel or self-hosted)
- Workspace task filtering (--filter syntax examples)
- Environment variable passthrough configuration
- Pruned Docker builds using turbo prune
```

### Nx Workspace
Append to the base prompt:
```
Configure using Nx with:
- workspace.json / project.json configuration
- Generators for scaffolding new libraries and applications
- Module boundary rules using tags and ESLint
- Affected command configuration for CI optimisation
- Computation caching (local and Nx Cloud)
```

### pnpm Workspace
Append to the base prompt:
```
Configure using pnpm workspaces with:
- pnpm-workspace.yaml defining workspace packages
- Shared dependencies hoisted to the root
- Catalogue for centralised dependency version management
- Scripts using pnpm --filter for targeted execution
- .npmrc configuration for strict dependency resolution
- Changeset configuration for versioning and publishing
```

## Tips

- Establish dependency boundaries early — they are hard to enforce retroactively
- Use incremental builds from day one; retrofitting caching is expensive
- Keep shared libraries small and focused — a "utils" package is a code smell
- Document the package dependency graph and keep it updated
- Use the /analyze command to audit existing dependency relationships
- Consider code ownership (CODEOWNERS) per package for review routing
- Avoid deep nesting — two levels of directories is usually sufficient
- Set up workspace-level commands for the most common developer tasks
