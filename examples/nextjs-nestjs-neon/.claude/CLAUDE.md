# Next.js + NestJS + Neon

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: NestJS
- **Database**: Neon Postgres
- **Testing**: Jest + Supertest (backend), Playwright (frontend)
- **Package Manager**: npm
- **Language**: TypeScript

## Architecture

### Overview

This project follows a layered architecture with a clear separation between the Next.js frontend and the NestJS backend.

The **NestJS backend** uses a strict layered pattern where dependencies flow inward only:

```
Controllers → Services → Repositories → Domain → Database
```

- **Controllers** handle HTTP concerns — request parsing, response shaping, and status codes. All logic is delegated to services.
- **Services** contain business logic, orchestrate repository calls, apply domain rules, and emit events.
- **Repositories** abstract database access via Prisma ORM, returning domain entities rather than raw Prisma types.
- **Domain** consists of pure TypeScript classes and interfaces with no framework or database dependencies.

The **Next.js frontend** uses the App Router with Server Components by default. Client Components are used only when interactivity, browser APIs, or React hooks are required. Data mutations flow through Server Actions, and data display favours Server Components to minimise client-side JavaScript.

### Key Design Decisions

- API-first design — the backend exposes a RESTful API consumed by the frontend.
- Type safety enforced across the full stack via TypeScript strict mode.
- Prisma ORM as the single source of truth for database schema and migrations.
- Neon Postgres for serverless-friendly database hosting with branching for preview environments.
- Shadcn/ui for composable, accessible UI components built on Radix primitives and Tailwind CSS.

### Data Flow

1. Client sends requests via Server Actions or direct API calls.
2. NestJS controllers receive requests and validate input via DTOs and pipes.
3. Services apply business rules and orchestrate data operations.
4. Repositories interact with Neon Postgres through Prisma Client.
5. Responses are serialised as DTOs and returned to the client.

## Development Commands

### Common Commands

```bash
# Install dependencies
npm install

# Start development servers (frontend + backend)
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Build for production
npm run build

# Lint and format
npm run lint
npm run format
```

### Database Commands

```bash
# Run Prisma migrations (development)
npx prisma migrate dev --name <descriptive_name>

# Deploy migrations (CI/CD)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Review migration diff
npx prisma migrate diff
```

### Testing Commands

```bash
# Run all tests
npm test

# Run backend unit tests
npx jest --config jest.config.ts

# Run backend tests with coverage
npx jest --coverage --ci

# Run E2E tests
npx playwright test

# Run E2E tests with UI
npx playwright test --ui

# View Playwright report
npx playwright show-report

# Update visual snapshots
npx playwright test --update-snapshots
```

### NestJS CLI Commands

```bash
# Generate a new module
npx nest generate module <name>

# Generate a new controller
npx nest generate controller <name>

# Generate a new service
npx nest generate service <name>

# Generate a complete resource (module + controller + service + DTOs)
npx nest generate resource <name>
```

## Code Style

### General

- Use TypeScript strict mode — `strict: true` in `tsconfig.json` with no exceptions.
- Enable `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`.
- Prefer named exports over default exports.
- Use `async/await` over raw Promises.
- Favour composition over inheritance.
- Prefer `unknown` over `any`. If `any` is unavoidable, add a `// eslint-disable` comment with justification.

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`, `create-user.dto.ts`)
- **Classes**: PascalCase (e.g., `UserService`, `CreateUserDto`)
- **Functions/Variables**: camelCase (e.g., `getUserById`, `isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `UserResponse`, `PaginatedResult`)
- **React Components**: PascalCase files in `components/` (e.g., `UserCard.tsx`)

### File Organisation

- Group by feature/module, not by type.
- Keep files focused — one primary export per file.
- Co-locate unit tests with source files (e.g., `user.service.spec.ts` beside `user.service.ts`).
- Place integration tests in a `test/` directory at the project root.

### Error Handling

- Use custom error classes for domain-specific errors.
- Always handle promise rejections.
- Log errors with sufficient context for debugging.
- Return meaningful error messages to API consumers.
- Throw NestJS built-in exceptions from services (`NotFoundException`, `BadRequestException`, etc.).

### Documentation

- Document public APIs with JSDoc/TSDoc comments.
- Include usage examples for complex utilities.
- Keep comments focused on "why", not "what".
- Decorate NestJS controllers with OpenAPI decorators for auto-generated documentation.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.module.ts           # Root module
│   │   ├── main.ts                 # Application entry point
│   │   ├── common/                 # Shared guards, pipes, filters, interceptors
│   │   │   ├── filters/            # Exception filters
│   │   │   ├── guards/             # Auth and role guards
│   │   │   ├── interceptors/       # Logging, transform interceptors
│   │   │   └── pipes/              # Validation pipes
│   │   ├── config/                 # Configuration module
│   │   ├── prisma/                 # PrismaService and PrismaModule
│   │   └── modules/               # Feature modules
│   │       ├── users/              # Example feature module
│   │       │   ├── users.module.ts
│   │       │   ├── users.controller.ts
│   │       │   ├── users.service.ts
│   │       │   ├── users.service.spec.ts
│   │       │   ├── users.repository.ts
│   │       │   ├── dto/
│   │       │   │   ├── create-user.dto.ts
│   │       │   │   ├── update-user.dto.ts
│   │       │   │   └── user-response.dto.ts
│   │       │   └── entities/
│   │       │       └── user.entity.ts
│   │       └── health/             # Health check module
│   ├── test/                       # Integration tests
│   │   ├── app.integration.spec.ts
│   │   └── utils/                  # Test utilities and factories
│   └── prisma/
│       ├── schema.prisma           # Database schema (source of truth)
│       ├── migrations/             # Migration history
│       └── seed.ts                 # Database seed script
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── (auth)/             # Auth route group
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (dashboard)/        # Dashboard route group
│   │   │   │   └── dashboard/page.tsx
│   │   │   └── api/                # Route handlers
│   │   ├── components/
│   │   │   ├── ui/                 # Shadcn/ui primitives
│   │   │   ├── features/           # Feature-specific components
│   │   │   └── shared/             # Shared components (header, footer)
│   │   ├── lib/                    # Utilities, API clients, helpers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── types/                  # Shared TypeScript types
│   │   └── styles/                 # Global styles
│   └── e2e/                        # Playwright E2E tests
│       ├── pages/                  # Page Objects
│       ├── fixtures/               # Test fixtures
│       └── screenshots/            # Visual regression baselines
├── docs/
│   ├── adr/                        # Architecture Decision Records
│   └── api/                        # API documentation
├── .claude/                        # Claude agent configuration
│   ├── agents/                     # Project-specific agent definitions
│   ├── commands/                   # Slash command definitions
│   ├── skills/                     # Skill definitions
│   └── settings.json               # Permissions and hooks
└── shared/                         # Shared types and utilities between frontend and backend
```

## Agent Configuration

This project uses the agentic-sdlc plugin for orchestration agents (task-orchestrator, architect, po, code-refactorer, ux-designer) and project-level agents for stack-specific work (be-dev, fe-dev, be-tester, fe-tester).

See agent-registry.md for the complete agent hierarchy.

### Agent Usage Guidelines

- **task-orchestrator**: Use for multi-step tasks that require coordination across agents. It routes work to the appropriate specialist agent.
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

- Follow RESTful conventions for all HTTP endpoints.
- Use consistent error response format: `{ statusCode, message, error, timestamp }`.
- Version APIs when introducing breaking changes (e.g., `/api/v1/`).
- Validate all input at the API boundary using DTOs and `ValidationPipe`.
- Document endpoints with OpenAPI/Swagger decorators.
- Return paginated responses in a consistent envelope: `{ data, meta: { total, page, limit, totalPages } }`.

### Testing

- Write tests for all new features and bug fixes.
- Maintain minimum 80% code coverage for critical backend paths.
- Use descriptive test names that explain the expected behaviour.
- Mock external dependencies in unit tests.
- Use factories or fixtures for test data.
- Run the full test suite before creating pull requests.

### Security

- Never commit secrets, API keys, or credentials.
- Use environment variables for configuration — validate with Joi or Zod.
- Validate and sanitise all user input.
- Follow the principle of least privilege for permissions.
- Implement authentication and authorisation guards on all protected endpoints.
- Store connection strings in environment variables — never commit them to source control.

### Performance

- Optimise database queries — avoid N+1 patterns.
- Use pagination for list endpoints with configurable limits.
- Cache expensive computations using `@nestjs/cache-manager`.
- Profile before optimising — measure, don't guess.
- Use Server Components in Next.js to reduce client-side JavaScript.
- Analyse frontend bundles with `@next/bundle-analyzer`.

### Accessibility

- Follow WCAG 2.1 AA guidelines for all frontend work.
- Use semantic HTML elements.
- Ensure keyboard navigation works correctly.
- Provide appropriate ARIA labels where needed.
- Integrate `@axe-core/playwright` for automated accessibility checks in E2E tests.
- Use `data-testid` attributes on interactive elements for reliable test selectors.
