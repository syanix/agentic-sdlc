# Astro + Supabase Project

## Tech Stack

- **Frontend**: Astro (Islands Architecture)
- **Backend**: Supabase (Client SDK + Edge Functions)
- **Database**: Supabase Postgres
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Package Manager**: npm
- **Language**: TypeScript

## Architecture

### Overview

This project uses Astro for the frontend with Islands Architecture for partial hydration, and Supabase as a Backend-as-a-Service providing Postgres database, authentication, real-time subscriptions, and Edge Functions.

### Key Design Decisions

- Astro Islands for minimal JavaScript — only interactive components hydrate on the client.
- Supabase client SDK for direct database access with Row Level Security.
- Edge Functions (Deno) for server-side logic that cannot run on the client.
- Type safety enforced with TypeScript and generated Supabase types.

### Data Flow

1. Astro pages render server-side by default (zero JS shipped).
2. Interactive islands hydrate on the client with framework components (React/Svelte/Vue).
3. Client-side components use Supabase client SDK for data operations.
4. Row Level Security policies enforce access control at the database level.
5. Edge Functions handle webhooks, scheduled tasks, and complex server logic.

## Development Commands

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npx vitest

# Run unit tests in watch mode
npx vitest --watch

# Run E2E tests
npx playwright test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and format
npm run lint
npm run format
```

### Database Commands

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts

# Start local Supabase
npx supabase start

# Run migrations
npx supabase db push

# Reset local database
npx supabase db reset

# Create new migration
npx supabase migration new <name>

# Deploy Edge Functions
npx supabase functions deploy <function-name>
```

## Code Style

### General

- Use TypeScript strict mode — `strict: true` in `tsconfig.json` with no exceptions.
- Prefer named exports over default exports.
- Use `async/await` over raw Promises.
- Favour composition over inheritance.
- Prefer `unknown` over `any`. If `any` is unavoidable, add a comment with justification.

### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.astro`, `auth-service.ts`)
- **Components**: PascalCase (e.g., `UserProfile.astro`, `LoginForm.tsx`)
- **Functions/Variables**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `UserResponse`)
- **Database tables**: snake_case (e.g., `user_profiles`)

### File Organisation

- Group by feature/module, not by type.
- Keep files focused — one primary export per file.
- Co-locate tests with source files.

### Error Handling

- Use custom error classes for domain-specific errors.
- Always handle promise rejections.
- Log errors with sufficient context for debugging.
- Return meaningful error messages to API consumers.

## Project Structure

```
├── src/
│   ├── pages/            # Astro pages (file-based routing)
│   ├── layouts/          # Page layouts
│   ├── components/       # UI components
│   │   ├── astro/        # Static Astro components
│   │   └── islands/      # Interactive island components (React/Svelte)
│   ├── lib/              # Utilities, Supabase client, helpers
│   ├── types/            # TypeScript types (including generated DB types)
│   ├── styles/           # Global styles
│   └── content/          # Content collections (if using)
├── supabase/
│   ├── functions/        # Edge Functions (Deno)
│   ├── migrations/       # Database migrations
│   └── config.toml       # Supabase local config
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets
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

- Use Supabase client SDK for direct database access where possible.
- Use Edge Functions for complex server-side logic.
- Apply Row Level Security policies for all tables.
- Generate TypeScript types from the database schema.

### Testing

- Write tests for all new features and bug fixes.
- Maintain minimum 80% code coverage for critical paths.
- Use descriptive test names that explain the expected behaviour.
- Mock Supabase client in unit tests.
- Use factories or fixtures for test data.

### Security

- Never commit secrets, API keys, or credentials.
- Use environment variables for Supabase project URL and anon key.
- Rely on Row Level Security for access control — never trust client-side checks alone.
- Validate and sanitise all user input in Edge Functions.

### Performance

- Leverage Astro's zero-JS-by-default for maximum performance.
- Only hydrate components that require interactivity.
- Use content collections for static content.
- Cache expensive Supabase queries where appropriate.

### Accessibility

- Follow WCAG 2.1 AA guidelines for all frontend work.
- Use semantic HTML elements in Astro components.
- Ensure keyboard navigation works correctly.
- Provide appropriate ARIA labels where needed.
