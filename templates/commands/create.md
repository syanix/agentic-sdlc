---
description: Create new components, endpoints, or database artifacts
---

# Create Command

Create new artefacts in the project with consistent structure and conventions.

## Usage

```
/create <type> <name> [options]
```

## Artefact Types

### API Endpoint

Create a new REST API endpoint with full NestJS scaffolding.

**Routes to: be-dev agent**

Steps:
1. Create or update the module file if this is a new feature module.
2. Create the controller with route handlers and Swagger decorators.
3. Create the service with business logic methods.
4. Create the repository for database access.
5. Create DTOs (Create, Update, Response) with validation decorators.
6. Register the module in `AppModule`.
7. Run tests to verify the endpoint works.

Checklist:
- [ ] Controller has `@ApiTags()` and `@ApiOperation()` decorators
- [ ] DTOs use `class-validator` decorators
- [ ] Service methods throw appropriate NestJS exceptions
- [ ] Repository handles soft deletes and timestamps
- [ ] Pagination is implemented for list endpoints
- [ ] Unit tests cover service logic
- [ ] Integration tests cover HTTP request/response cycle

### Frontend Component

Create a new React component or page with Next.js App Router conventions.

**Routes to: fe-dev agent**

Steps:
1. Determine if this is a page, layout, or reusable component.
2. Create the component file with appropriate Server/Client Component directive.
3. Create associated hooks if client-side state is needed.
4. Add Shadcn/ui primitives where applicable.
5. Create or update the route segment files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
6. Add `data-testid` attributes for E2E testing.
7. Verify the component renders correctly.

Checklist:
- [ ] Component defaults to Server Component unless interactivity is required
- [ ] `'use client'` boundary is as low as possible in the tree
- [ ] Tailwind classes follow mobile-first responsive pattern
- [ ] Loading and error states are handled
- [ ] Accessibility: proper ARIA attributes, keyboard navigation
- [ ] `data-testid` attributes added for testable elements

### Database Migration

Create a new database migration for schema changes.

**Routes to: be-dev agent**

Steps:
1. Update `prisma/schema.prisma` with the schema change.
2. Run `npx prisma migrate dev --name <descriptive_name>` to generate the migration.
3. Review the generated SQL in `prisma/migrations/`.
4. Run `npx prisma generate` to update the Prisma Client.
5. Update affected repositories and DTOs to reflect the schema change.
6. Test the migration on a Neon branch before merging.

Checklist:
- [ ] Migration is incremental and reversible
- [ ] Indexes added for foreign keys and filtered columns
- [ ] `createdAt`, `updatedAt` timestamps included
- [ ] Soft delete field added if applicable
- [ ] UUIDs used for public-facing IDs
- [ ] Migration tested on a Neon branch

### Full Module

Create a complete feature module spanning backend and frontend.

**Routes to: be-dev then fe-dev agents**

Steps:
1. **Backend**: Create module, controller, service, repository, DTOs, and entity.
2. **Backend**: Write unit tests for the service and integration tests for the controller.
3. **Database**: Create and apply the Prisma migration.
4. **Frontend**: Create the page route and components.
5. **Frontend**: Implement data fetching (server actions or API calls).
6. **Frontend**: Add form handling with validation.
7. **E2E**: Write Playwright tests for the user flow.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Show what would be created without writing files | `false` |
| `--skip-tests` | Skip test file generation | `false` |
| `--module <name>` | Specify the parent module | auto-detect |

## Examples

```
/create endpoint users/preferences
/create component UserProfileCard
/create migration add-user-preferences-table
/create module notifications
```
