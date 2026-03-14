# React + Go + Fly.io Project

## Tech Stack

- **Frontend**: React (Vite SPA)
- **Backend**: Go (Gin framework)
- **Database**: Fly.io Postgres
- **Testing**: go test (backend) + Playwright (frontend E2E)
- **Package Manager**: npm (frontend), go modules (backend)
- **Language**: TypeScript (frontend), Go (backend)

## Architecture

### Overview
This project uses a React single-page application built with Vite for the frontend, and a Go API server using the Gin framework for the backend. The database is Fly.io managed Postgres.

### Key Design Decisions
- React SPA with client-side routing via React Router
- Go backend following standard project layout (cmd/, internal/, pkg/)
- Clean separation between frontend and backend — API-first design
- Type safety: TypeScript on frontend, Go's type system on backend
- sqlc for type-safe SQL queries (no ORM magic)

### Data Flow
1. React app makes HTTP requests to the Go API via fetch/axios
2. Gin middleware handles authentication, logging, and CORS
3. Handler functions validate input and call service layer
4. Services contain business logic and call repository layer
5. Repositories execute sqlc-generated queries against Fly.io Postgres
6. Responses are serialised as JSON and returned to the client

## Development Commands

### Frontend Commands
```bash
# Install frontend dependencies
cd frontend && npm install

# Start frontend dev server (with API proxy)
cd frontend && npm run dev

# Run frontend E2E tests
cd frontend && npx playwright test

# Build frontend for production
cd frontend && npm run build

# Lint frontend
cd frontend && npm run lint
```

### Backend Commands
```bash
# Download Go dependencies
go mod download

# Run backend server
go run cmd/server/main.go

# Run all backend tests
go test ./...

# Run tests with race detector
go test -race ./...

# Run tests with coverage
go test -coverprofile=coverage.out ./...

# Generate sqlc types
sqlc generate

# Run database migrations
go run cmd/migrate/main.go up

# Lint Go code
golangci-lint run
```

### Database Commands
```bash
# Connect to Fly.io Postgres
fly postgres connect -a <app-name>

# Create a new migration
migrate create -ext sql -dir migrations -seq <name>

# Run migrations against Fly.io
fly ssh console -C "migrate -path /app/migrations -database $DATABASE_URL up"

# Proxy Fly.io Postgres locally
fly proxy 5433:5432 -a <postgres-app-name>
```

## Code Style

### Go Backend
- Follow standard Go conventions (gofmt, go vet, golangci-lint)
- Use standard project layout: cmd/ for entry points, internal/ for private packages, pkg/ for public packages
- Prefer returning errors over panicking
- Use context.Context for cancellation and request-scoped values
- Keep interfaces small — one or two methods
- Use table-driven tests

### TypeScript Frontend
- Use TypeScript strict mode
- Prefer named exports over default exports
- Use async/await over raw Promises
- Use functional components with hooks

### Naming Conventions
- **Go files**: snake_case (e.g., `user_handler.go`)
- **Go types/functions**: PascalCase exported, camelCase unexported
- **TS files**: kebab-case (e.g., `user-profile.tsx`)
- **React components**: PascalCase (e.g., `UserProfile.tsx`)
- **Database tables**: snake_case (e.g., `user_profiles`)

### Error Handling
- Go: return errors, wrap with fmt.Errorf and %w verb, use errors.Is/As
- Frontend: try/catch with typed error responses from API
- Log errors with structured logging (slog)
- Return meaningful HTTP error responses in JSON

## Project Structure

```
├── cmd/
│   ├── server/           # Main API server entry point
│   └── migrate/          # Database migration runner
├── internal/
│   ├── handler/          # HTTP handlers (Gin)
│   ├── service/          # Business logic
│   ├── repository/       # Database queries (sqlc-generated)
│   ├── middleware/       # Gin middleware (auth, logging, CORS)
│   ├── model/            # Domain models
│   └── config/           # Configuration loading
├── pkg/                  # Shared public packages
├── migrations/           # SQL migration files
├── sqlc/                 # sqlc configuration and queries
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client services
│   │   ├── stores/       # State management (Zustand)
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities
│   ├── e2e/              # Playwright E2E tests
│   └── public/           # Static assets
├── docs/                 # Project documentation
└── .claude/              # Claude agent configuration
    ├── agents/           # Project-specific agent definitions
    └── settings.json     # Permissions and hooks
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
- Follow RESTful conventions for HTTP APIs.
- Use consistent JSON error response format: `{"error": "message", "code": "ERROR_CODE"}`.
- Version APIs with URL prefix (e.g., `/api/v1/`).
- Validate all input at the handler boundary using Go struct tags.

### Testing
- Write tests for all new features and bug fixes.
- Go: use table-driven tests, aim for 80% coverage on critical paths.
- Frontend: use Playwright for E2E user journey tests.
- Mock external dependencies using interfaces in Go.

### Security
- Never commit secrets, API keys, or credentials.
- Use environment variables for configuration.
- Validate and sanitise all user input.
- Use CORS middleware to restrict origins.
- Use bcrypt for password hashing, JWT for session tokens.

### Performance
- Use sqlc for zero-overhead type-safe SQL (no ORM reflection).
- Connection pooling via pgxpool.
- Profile with Go pprof before optimising.
- Use React.lazy for code splitting on the frontend.

### Accessibility
- Follow WCAG 2.1 AA guidelines for frontend work.
- Use semantic HTML elements.
- Ensure keyboard navigation works correctly.
- Provide appropriate ARIA labels where needed.
