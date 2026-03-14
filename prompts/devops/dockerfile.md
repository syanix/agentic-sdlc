---
name: Dockerfile Creation
domain: devops
complexity: medium
works-with: [architect agent, /deploy command]
---

# Dockerfile Creation Prompt

## When to Use

Use this prompt when you need to create a production-ready, multi-stage Dockerfile with best practices for security, caching, and minimal image size.

## The Prompt

```
Create a production-ready multi-stage Dockerfile.

## Runtime
[RUNTIME]

## Application Framework
[APP_FRAMEWORK]

## Build Steps
[BUILD_STEPS]

## Exposed Port
[PORT]

The Dockerfile must:
1. Use multi-stage builds to minimise final image size
2. Run as a non-root user in the final stage
3. Optimise layer caching (copy dependency files before source code)
4. Include a HEALTHCHECK instruction
5. Use specific image tags (never use :latest)
6. Set appropriate environment variables for production
7. Include labels for image metadata (maintainer, version, description)

Additionally provide:
- A .dockerignore file listing files to exclude
- Build and run commands with recommended flags
- Expected final image size estimate
```

## Variations

### Node.js Multi-Stage
Append to the base prompt:
```
Use Node.js with these stage considerations:
- Stage 1 (deps): Install production dependencies only (npm ci --omit=dev)
- Stage 2 (build): Install all dependencies and compile TypeScript/bundle
- Stage 3 (runtime): Copy built artefacts and production node_modules only
- Use node:22-alpine as the base image
- Set NODE_ENV=production in the final stage
- Use tini or dumb-init as PID 1 for proper signal handling
- Configure memory limits via NODE_OPTIONS
```

### Go Binary
Append to the base prompt:
```
Use Go with these stage considerations:
- Stage 1 (build): Compile a statically-linked binary with CGO_ENABLED=0
- Stage 2 (runtime): Use scratch or distroless as the final base image
- Copy CA certificates and timezone data from the build stage
- Set GOOS, GOARCH, and use ldflags to strip debug info and embed version
- Cache Go module downloads in a separate layer
- Final image should be under 20MB
```

### Python with uv
Append to the base prompt:
```
Use Python with uv package manager:
- Stage 1 (build): Install uv, sync dependencies, and build the application
- Stage 2 (runtime): Use python:3.12-slim as the final base image
- Copy the virtual environment from the build stage
- Use --no-install-recommends for apt packages
- Set PYTHONDONTWRITEBYTECODE=1 and PYTHONUNBUFFERED=1
- Pin uv version in the build stage for reproducibility
- Include gunicorn or uvicorn as the production WSGI/ASGI server
```

## Tips

- Order Dockerfile instructions from least to most frequently changing
- Copy package manifests (package.json, go.mod) before source code for better caching
- Never include secrets in the image — use build-time secrets or runtime injection
- Scan images with tools like Trivy or Grype before deploying
- Use .dockerignore to exclude .git, node_modules, and test files from the build context
- Pair with the /deploy command to integrate Dockerfile into deployment workflows
- Consider using Chainguard or distroless base images for reduced attack surface
- Test your Dockerfile locally before pushing to CI — rebuilds in CI are slow
