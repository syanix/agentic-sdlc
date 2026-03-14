---
name: Code Review
domain: code-quality
complexity: medium
works-with: [code-refactorer agent, /review command]
---

# Code Review Prompt

## When to Use

Use this prompt when reviewing pull requests or code changes to provide structured, constructive feedback covering correctness, readability, and adherence to project conventions.

## The Prompt

You are a thorough, constructive code reviewer. Review the following changes.

**PR description:**
[PR_DESCRIPTION]

**Files changed:**
[FILES_CHANGED]

**Project conventions:**
[PROJECT_CONVENTIONS]

**Focus areas:**
[FOCUS_AREAS]

For each file, evaluate:
1. **Correctness** — Does the logic handle all cases, including edge cases and errors?
2. **Readability** — Is the code clear and well-organised? Are names descriptive?
3. **Maintainability** — Will this be easy to modify in six months?
4. **Conventions** — Does it follow the project's established patterns and style?
5. **Test coverage** — Are new behaviours adequately tested?

Categorise each finding by severity:
- **Critical** — Bug, data loss risk, or security vulnerability. Must fix before merge.
- **Major** — Significant design issue or convention violation. Should fix before merge.
- **Minor** — Style nit, small improvement, or optional suggestion.
- **Praise** — Something done well worth calling out.

---

## Variations

### Security-Focused Review

Review `[FILES_CHANGED]` with a security-first lens. Check for:
- Input validation and sanitisation gaps
- Authentication and authorisation bypass risks
- Injection vulnerabilities (SQL, XSS, command injection)
- Secrets or credentials in code or configuration
- Data exposure in logs, errors, or API responses
Reference OWASP Top 10 where applicable. Severity should reflect exploitability.

### Performance Review

Review `[FILES_CHANGED]` for performance concerns:
- N+1 queries or unnecessary database round-trips
- Unbounded collections or missing pagination
- Expensive operations inside loops
- Memory allocation patterns that may cause pressure under load
Provide estimated impact (low/medium/high) for each finding.

### Architecture Review

Review `[FILES_CHANGED]` for architectural alignment:
- Does the change respect existing module boundaries?
- Are dependencies flowing in the correct direction?
- Are cross-cutting concerns (logging, error handling) handled consistently?
- Does this change make future planned work easier or harder?

---

## Tips

- Lead with what the author did well — constructive reviews build trust.
- Ask questions rather than demands: "Have you considered..." beats "You must...".
- Distinguish between personal preference and genuine issues.
- Use the `/review` command for an initial automated review, then add human judgement.
- The `code-refactorer` agent can suggest alternatives for problematic patterns.
- When reviewing large PRs, focus on the most impactful files first.
- Verify that error messages are helpful and do not leak internal details.
