---
description: Debug errors systematically with specialised agents
---

# Debug Command

Systematically diagnose, investigate, and resolve errors.

## Usage

```
/debug <error-description-or-paste>
```

## Debugging Process

### Step 1: Error Analysis and Categorisation

Analyse the error to determine its category and the appropriate agent to handle it.

| Error Pattern | Category | Agent |
|---------------|----------|-------|
| `TS2xxx` type errors | TypeScript | be-dev or fe-dev |
| `P2xxx` Prisma errors | Database | be-dev |
| `ECONNREFUSED`, connection timeout | Infrastructure | be-dev |
| `401`, `403` HTTP status | Authentication | be-dev + fe-dev |
| `Hydration mismatch`, `use client` errors | React/Next.js | fe-dev |
| `Cannot find module` | Module resolution | be-dev or fe-dev |
| Test assertion failures | Testing | be-dev or fe-dev |
| `CORS`, `preflight` errors | API/Network | be-dev |
| `500 Internal Server Error` | Backend logic | be-dev |
| Visual/layout issues | Styling | fe-dev |

### Step 2: Root Cause Investigation

Follow a structured investigation based on the error category.

**For runtime errors:**
1. Read the full error message and stack trace.
2. Identify the originating file and line number.
3. Trace the call chain upward to find where bad data entered.
4. Check recent changes to the affected files (`git log -p <file>`).
5. Reproduce the error with a minimal test case.

**For build/compilation errors:**
1. Run the relevant compiler (`tsc --noEmit`, `next build`, `nest build`).
2. Read each error from bottom to top — the root cause is often the first error.
3. Check `tsconfig.json` for misconfigured paths or options.
4. Verify dependency versions in `package.json` and `package-lock.json`.

**For database errors:**
1. Check migration status: `npx prisma migrate status`.
2. Verify the schema matches the database: `npx prisma db pull` and diff.
3. Test connectivity with a simple query.
4. Check Neon dashboard for compute status and connection limits.

**For test failures:**
1. Run the failing test in isolation with `--verbose`.
2. Check if the test is flaky by running it multiple times.
3. Inspect mock setup — are mocks returning the expected data?
4. Check for state leakage from other tests.

**For frontend rendering errors:**
1. Check the browser console for errors and warnings.
2. Verify Server vs Client Component boundaries.
3. Check for hydration mismatches — ensure server and client render the same content.
4. Inspect the component props and state at the point of failure.

### Step 3: Fix Implementation

Once the root cause is identified, route to the appropriate agent for the fix.

**Guidelines:**
- Fix the root cause, not just the symptom. If a null check fixes the crash but the data should never be null, fix the data source.
- Make the minimal change necessary. Avoid refactoring unrelated code during a fix.
- Consider whether the fix introduces regression risk. If so, add a test.
- Document non-obvious fixes with a code comment explaining *why*.

### Step 4: Verification

After applying the fix, verify it resolves the issue without introducing regressions.

1. **Reproduce**: Confirm the original error no longer occurs.
2. **Type check**: Run `npx tsc --noEmit` to ensure no new type errors.
3. **Unit tests**: Run tests for the affected module: `npx jest <module>`.
4. **Integration tests**: Run API tests if the fix affects endpoints.
5. **E2E tests**: Run relevant Playwright tests if the fix affects user flows.
6. **Build**: Run a full build (`npm run build`) to catch any remaining issues.

## Common Debugging Patterns

### Null/Undefined Errors

```
TypeError: Cannot read properties of undefined (reading 'x')
```
- Check the data source (API response, database query, prop drilling).
- Add null guards with optional chaining (`?.`) or nullish coalescing (`??`).
- Validate data at the boundary where it enters the system.

### Prisma Errors

```
PrismaClientKnownRequestError: P2025 Record not found
```
- Check that the record exists before operating on it.
- Use `findFirst` with a null check instead of `findFirstOrThrow` when the record may not exist.
- Verify the query filters match the actual data.

### Next.js Hydration Errors

```
Error: Hydration failed because the initial UI does not match
```
- Ensure components using browser APIs (window, localStorage) are marked `'use client'`.
- Avoid rendering different content on server vs client (e.g., dates, random values).
- Use `useEffect` for client-only logic, not conditional rendering based on `typeof window`.

### CORS Errors

```
Access to fetch has been blocked by CORS policy
```
- Configure CORS in the NestJS backend: `app.enableCors({ origin: allowedOrigins })`.
- Ensure preflight (OPTIONS) requests are handled.
- Verify the frontend is using the correct API base URL.

## Examples

```
/debug "TypeError: Cannot read properties of undefined (reading 'email') in UserService"
/debug "P2002: Unique constraint failed on the fields: (`email`)"
/debug "Hydration mismatch on the dashboard page"
/debug "Jest test timing out in auth.service.spec.ts"
```
