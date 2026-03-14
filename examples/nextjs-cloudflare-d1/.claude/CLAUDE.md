# Next.js + Cloudflare Workers + D1 Project

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Testing**: Vitest (backend/unit) + Playwright (frontend E2E)
- **Package Manager**: npm
- **Language**: TypeScript

## Architecture

### Overview

This project uses Next.js with App Router for the frontend and Cloudflare Workers with the Hono framework for the backend API. Data is stored in Cloudflare D1, a serverless SQLite-compatible database deployed at the edge.

### Key Design Decisions

- Next.js App Router with Server Components for optimal performance.
- Cloudflare Workers for globally distributed, low-latency API endpoints.
- Hono as a lightweight, edge-native web framework running on Workers.
- D1 for SQLite-compatible database operations at the edge.
- Drizzle ORM for type-safe database access with D1.
- Type safety enforced across the full stack with TypeScript.

### Data Flow

1. Next.js Server Components fetch data from Cloudflare Workers API.
2. Client Components use Server Actions or fetch for mutations.
3. Hono routes handle API requests in Cloudflare Workers.
4. Drizzle ORM generates type-safe queries for D1.
5. D1 executes SQLite-compatible queries at the edge.
6. Responses are serialised and returned through the stack.

## Development Commands

### Common Commands

```bash
# Install dependencies
npm install

# Start Next.js dev server
npm run dev

# Start Workers dev server (local D1)
npx wrangler dev

# Run unit tests
npx vitest

# Run E2E tests
npx playwright test

# Build frontend
npm run build

# Lint and format
npm run lint
npm run format
```

### Database Commands

```bash
# Create new D1 database
npx wrangler d1 create <database-name>

# Run migrations locally
npx wrangler d1 migrations apply <database-name> --local

# Run migrations in production
npx wrangler d1 migrations apply <database-name> --remote

# Create new migration
npx wrangler d1 migrations create <database-name> <migration-name>

# Execute raw SQL against local D1
npx wrangler d1 execute <database-name> --local --command "SELECT * FROM users"

# Generate Drizzle types
npx drizzle-kit generate
```

### Deployment Commands

```bash
# Deploy Workers
npx wrangler deploy

# Deploy Next.js to Cloudflare Pages (or Vercel)
npm run deploy

# View Workers logs
npx wrangler tail
```

## Code Style

### General

- Use TypeScript strict mode in both frontend and Workers.
- Prefer named exports over default exports.
- Use `async/await` over raw Promises.
- Favour composition over inheritance.

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes/Types**: PascalCase (e.g., `UserService`, `UserResponse`)
- **Functions/Variables**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **D1 tables**: snake_case (e.g., `user_profiles`)
- **Workers routes**: kebab-case (e.g., `/api/user-profiles`)

### File Organisation

- Group by feature/module, not by type.
- Keep files focused — one primary export per file.
- Co-locate tests with source files.

### Error Handling

- Use custom error classes for domain-specific errors.
- Always handle promise rejections.
- Return consistent JSON error responses from Workers.
- Log errors with sufficient context for debugging.

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn/ui primitives
│   │   │   ├── features/     # Feature-specific components
│   │   │   └── shared/       # Shared components
│   │   ├── lib/              # Utilities, API client
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # Frontend types
│   │   └── styles/           # Global styles
│   └── e2e/                  # Playwright E2E tests
├── workers/
│   ├── src/
│   │   ├── index.ts          # Hono app entry point
│   │   ├── routes/           # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── db/
│   │   │   ├── schema.ts     # Drizzle schema definitions
│   │   │   └── queries/      # Query helpers
│   │   ├── middleware/       # Hono middleware
│   │   ├── types/            # Worker types and bindings
│   │   └── utils/            # Utilities
│   ├── migrations/           # D1 SQL migration files
│   ├── wrangler.toml         # Workers configuration
│   └── vitest.config.ts      # Vitest config for Workers
├── shared/                   # Shared types between frontend and workers
├── docs/                     # Project documentation
└── .claude/                  # Claude agent configuration
    ├── agents/               # Project-specific agent definitions
    └── settings.json         # Permissions and hooks
```

## Agent Configuration

This project uses the agentic-sdlc plugin for orchestration agents (task-orchestrator, architect, po, code-refactorer, ux-designer) and project-level agents for stack-specific work (be-dev, fe-dev, be-tester, fe-tester).

See agent-registry.md for the complete agent hierarchy.

### Agent Usage Guidelines

- **task-orchestrator**: Use for multi-step tasks that require coordination across agents.
- **architect**: Use for system design decisions, creating ADRs, and evaluating architectural trade-offs.
- **po**: Use for writing user stories, acceptance criteria, and product documentation.
- **be-dev / fe-dev**: Use for implementing features in their respective stack areas.
- **be-tester / fe-tester**: Use for writing and maintaining tests.
- **code-refactorer**: Use for improving code quality, reducing duplication, and applying design patterns.
- **ux-designer**: Use for UI/UX design decisions and component design.

### Delegation Rules

- Orchestration agents (opus-tier) may delegate to project agents (sonnet-tier).
- Project agents should not delegate to other project agents — escalate to the orchestrator instead.
- Always verify agent output before committing changes.

## Key Conventions

### Git Workflow

- Use conventional commits (e.g., `feat:`, `fix:`, `chore:`, `docs:`).
- Keep commits atomic and focused on a single change.
- Write descriptive commit messages explaining the "why".
- Never force push to shared branches.

### API Design

- Use Hono for routing — lightweight and edge-native.
- Follow RESTful conventions for HTTP endpoints.
- Return consistent JSON error responses: `{ "error": "message", "code": "ERROR_CODE" }`.
- Validate input with Zod schemas in middleware.

### Testing

- Write tests for all new features and bug fixes.
- Use Vitest for Workers unit and integration tests.
- Use Playwright for frontend E2E tests.
- Mock D1 bindings in unit tests using miniflare.

### Security

- Never commit secrets, API keys, or credentials.
- Use Workers secrets for sensitive configuration.
- Validate and sanitise all user input.
- Use Cloudflare Access or JWT middleware for authentication.

### Performance

- Leverage D1's edge locality for low-latency reads.
- Use Workers KV for frequently accessed, rarely changing data.
- Use Next.js Server Components to minimise client-side JavaScript.
- Cache API responses with Cache API in Workers.

### Accessibility

- Follow WCAG 2.1 AA guidelines for frontend work.
- Use semantic HTML elements.
- Ensure keyboard navigation works correctly.
- Provide appropriate ARIA labels where needed.
