---
description: Pre-deployment validation and readiness check
---

# /deploy — Pre-Deployment Validation & Readiness Check

Orchestrate a comprehensive pre-deployment validation by engaging ALL specialist agents in parallel. Each agent evaluates readiness within their domain, producing a consolidated go/no-go assessment.

## Usage

```
/deploy [environment]
```

- **environment**: `staging` | `production` | `preview` (default: `staging`)

## Validation Domains & Agent Assignments

All agents execute in parallel for maximum efficiency:

### 1. Code Quality (Code Quality Agent)
- [ ] No linting errors or warnings
- [ ] No unresolved TODO/FIXME/HACK comments in critical paths
- [ ] Code complexity within acceptable thresholds
- [ ] No debug code or temporary workarounds remaining
- [ ] Consistent error handling patterns

### 2. Security (Architect Agent)
- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all external inputs
- [ ] Authentication and authorisation properly enforced
- [ ] Dependencies free of known vulnerabilities
- [ ] Sensitive data not logged or exposed
- [ ] CORS and CSP headers properly configured

### 3. Testing (Testing Agent)
- [ ] All test suites passing
- [ ] Adequate test coverage on changed code
- [ ] Critical paths have integration tests
- [ ] No skipped or disabled tests without justification
- [ ] Edge cases and error scenarios covered

### 4. Database (Backend Developer Agent)
- [ ] Migrations are reversible and tested
- [ ] No destructive schema changes without migration plan
- [ ] Indexes exist for frequently queried fields
- [ ] Data integrity constraints in place
- [ ] Seed data and reference data up to date

### 5. API (Backend Developer Agent)
- [ ] All endpoints return correct status codes
- [ ] Request/response contracts match documentation
- [ ] Rate limiting and throttling configured
- [ ] Error responses follow consistent format
- [ ] Backwards compatibility maintained (or versioned)

### 6. Frontend (Frontend Developer Agent)
- [ ] Build completes without errors or warnings
- [ ] No console errors in primary user flows
- [ ] Responsive behaviour verified
- [ ] Accessibility requirements met
- [ ] Assets optimised (images, fonts, bundles)

### 7. Infrastructure (DevOps Agent)
- [ ] Environment variables documented and configured
- [ ] Health check endpoints operational
- [ ] Logging and monitoring configured
- [ ] Rollback procedure documented and tested
- [ ] Resource limits and scaling policies set

### 8. Documentation (Product Owner Agent)
- [ ] Changelog or release notes updated
- [ ] API documentation reflects changes
- [ ] Breaking changes clearly communicated
- [ ] Runbook updated for new operational procedures
- [ ] User-facing documentation current

## Execution Strategy

1. **Parallel dispatch**: Launch all agent validations simultaneously
2. **Progressive reporting**: Display results as each agent completes
3. **Cross-validation**: Identify conflicts between agent findings
4. **Consolidation**: Merge all results into a single readiness report
5. **Verdict**: Calculate overall deployment readiness

## Verdict Criteria

- **PASS**: All checks pass, no critical or high-severity issues
- **WARNING**: Minor issues found, deployment acceptable with noted risks
- **FAIL**: Critical issues found, deployment blocked until resolved

## Output Format

```
## Deployment Readiness: [environment]
### Date: [timestamp]

### Verdict: [PASS / WARNING / FAIL]

#### Domain Results
| Domain          | Status  | Issues | Notes                    |
|-----------------|---------|--------|--------------------------|
| Code Quality    | PASS    | 0      |                          |
| Security        | WARNING | 1      | [brief note]             |
| Testing         | PASS    | 0      |                          |
| Database        | PASS    | 0      |                          |
| API             | PASS    | 0      |                          |
| Frontend        | PASS    | 0      |                          |
| Infrastructure  | PASS    | 0      |                          |
| Documentation   | WARNING | 1      | [brief note]             |

#### Critical Issues (blocking)
- [None / list of blocking issues]

#### Warnings (non-blocking)
- [List of warnings with recommendations]

#### Deployment Notes
- [Any special instructions for this deployment]
- [Rollback triggers and procedure summary]
```
