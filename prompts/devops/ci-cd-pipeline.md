---
name: CI/CD Pipeline
domain: devops
complexity: high
works-with: [architect agent, /deploy command]
---

# CI/CD Pipeline Prompt

## When to Use

Use this prompt when you need to design or configure a CI/CD pipeline, covering build stages, deployment targets, caching, and environment promotion flows.

## The Prompt

```
Design a CI/CD pipeline configuration for the following project.

## CI Platform
[CI_PLATFORM]

## Pipeline Stages
[STAGES]

## Deployment Target
[DEPLOYMENT_TARGET]

## Branch Strategy
[BRANCH_STRATEGY]

For each stage, define:
1. Trigger conditions (branch, path filters, manual approval)
2. Steps with specific commands
3. Environment variables and secrets required
4. Caching strategy for dependencies and build artefacts
5. Failure handling and notification behaviour
6. Estimated duration target

Additionally provide:
- Parallelisation strategy to minimise total pipeline duration
- Environment promotion flow (dev -> staging -> production)
- Rollback procedure triggered from the pipeline
- Secret management approach (no secrets in pipeline files)
```

## Variations

### GitHub Actions
Append to the base prompt:
```
Output as GitHub Actions workflow YAML files.
Include:
- Reusable workflows for shared steps (using workflow_call)
- Matrix builds for multi-version or multi-platform testing
- Concurrency groups to cancel superseded runs
- OIDC-based authentication for cloud deployments (no long-lived secrets)
- Artefact upload/download between jobs
- Status checks required for branch protection
```

### GitLab CI
Append to the base prompt:
```
Output as .gitlab-ci.yml configuration.
Include:
- Stage definitions with job dependencies (needs:)
- Rules-based pipeline triggering (not only/except)
- DAG (directed acyclic graph) pipeline for parallel execution
- Environment definitions with auto-stop for review apps
- Include templates for shared configuration
- Cache and artefact configuration with appropriate expiry
```

### Multi-Environment Pipeline
Append to the base prompt:
```
Design a pipeline that deploys to multiple environments:
- Development: auto-deploy on merge to main
- Staging: auto-deploy with integration test gate
- Production: manual approval with deployment window restrictions

Include:
- Environment-specific configuration management
- Database migration execution strategy per environment
- Feature flag integration for progressive rollouts
- Canary or blue-green deployment steps
```

## Tips

- Optimise for pipeline speed — slow pipelines destroy developer productivity
- Cache aggressively: dependencies, build outputs, Docker layers
- Run linting and unit tests in parallel, not sequentially
- Fail fast: put the quickest checks (lint, type-check) first
- Use path-based filtering in monorepos to avoid unnecessary builds
- Pair with the /deploy command to generate deployment-specific configuration
- Never store secrets in pipeline configuration files — use platform secret management
- Set up pipeline duration alerts to catch gradual slowdowns
