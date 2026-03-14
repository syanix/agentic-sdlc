---
description: Fix common issues quickly - types, builds, tests, database
---

# Fix Command

Quickly diagnose and fix common issues by error category.

## Usage

```
/fix <category> [description]
```

## Error Categories

### TypeScript / Build Errors

**Routes to: be-dev or fe-dev based on file location**

Common issues and solutions:

1. **Type mismatch**: Check DTO definitions, ensure Prisma types are mapped correctly to response types.
2. **Missing imports**: Run the TypeScript compiler to identify unresolved modules. Check `tsconfig.json` paths.
3. **Strict mode violations**: Address `strictNullChecks` by adding null guards or using optional chaining.
4. **Build failures**: Clear `.next/` or `dist/` cache directories and rebuild.

Steps:
1. Run `npx tsc --noEmit` to get the full list of type errors.
2. Categorise errors by file and type.
3. Fix errors starting from the lowest-level files (types, entities) upward (services, controllers, components).
4. Re-run the type checker to verify all errors are resolved.

### Database Errors

**Routes to: be-dev agent**

Common issues and solutions:

1. **Migration drift**: Run `npx prisma migrate status` to check for unapplied migrations. Apply with `npx prisma migrate deploy`.
2. **Schema out of sync**: Run `npx prisma generate` after schema changes.
3. **Connection errors**: Verify the `DATABASE_URL` environment variable. Check Neon dashboard for compute status.
4. **Query errors**: Check Prisma query syntax. Use `$queryRaw` for complex queries not supported by Prisma's query builder.
5. **Constraint violations**: Check unique constraints, foreign keys, and not-null constraints in the schema.

Steps:
1. Check the error message and stack trace.
2. Verify database connectivity with a simple query.
3. Check migration status and schema consistency.
4. Fix the root cause and verify with a test query.

### Test Failures

**Routes to: be-dev or fe-dev based on test type**

Common issues and solutions:

1. **Flaky tests**: Identify non-deterministic behaviour (timing, ordering, external dependencies). Add proper waits or mocks.
2. **Stale snapshots**: Review and update with `--updateSnapshot` if the change is intentional.
3. **Mock issues**: Ensure mocks are reset between tests. Check `jest.clearAllMocks()` in `beforeEach`.
4. **Database state**: Ensure test database is clean. Check setup/teardown hooks.
5. **E2E timeouts**: Increase timeouts for slow operations. Add explicit waits for network requests.

Steps:
1. Run the failing test in isolation: `npx jest <file> --verbose`.
2. Check the error message and assertion diff.
3. Verify mock setup and test data.
4. Fix and re-run to confirm.

### Auth Errors

**Routes to: be-dev or fe-dev based on error location**

Common issues and solutions:

1. **Token expired**: Check token TTL configuration. Implement refresh token flow.
2. **CORS errors**: Verify CORS configuration in the NestJS backend. Check allowed origins.
3. **Session issues**: Check NextAuth configuration. Verify session provider wraps the app.
4. **Guard failures**: Check NestJS guard logic. Verify JWT secret matches between services.
5. **Middleware blocking**: Check Next.js middleware matcher patterns. Ensure public routes are excluded.

Steps:
1. Check browser network tab for the failing request and response.
2. Verify authentication configuration on both frontend and backend.
3. Test the auth flow end-to-end with fresh credentials.
4. Fix and verify with a full login/logout cycle.

## Quick Reference

| Symptom | Likely Category | First Step |
|---------|----------------|------------|
| `TS2345: Argument of type...` | TypeScript | Check DTO/type definitions |
| `P2002: Unique constraint failed` | Database | Check unique fields in schema |
| `ECONNREFUSED` | Database | Check DATABASE_URL and Neon compute |
| `Expected ... received ...` | Tests | Check mock setup and test data |
| `401 Unauthorised` | Auth | Check token and guard config |
| `NEXT_NOT_FOUND` | Build | Check route file structure |

## Examples

```
/fix types "DTO doesn't match Prisma model"
/fix database "migration failed on deploy"
/fix tests "user service spec failing after refactor"
/fix auth "getting 401 on protected API route"
```
