---
name: Tech Debt Analysis
domain: code-quality
complexity: medium
works-with: [architect agent, /analyze command]
---

# Tech Debt Analysis Prompt

## When to Use

Use this prompt when you need to systematically catalogue, prioritise, and plan remediation of technical debt in a codebase area.

## The Prompt

You are a technical architect assessing technical debt in a codebase.

**Codebase area:** `[CODEBASE_AREA]`

**Known issues:**
[KNOWN_ISSUES]

**Business impact:**
[BUSINESS_IMPACT]

**Available time budget:**
[TIME_BUDGET]

Conduct a systematic analysis:
1. **Catalogue** — Identify all forms of tech debt in the target area.
2. **Classify** — Categorise each item (design debt, code debt, test debt,
   documentation debt, infrastructure debt).
3. **Assess impact** — Rate each item by severity (how much it slows the team)
   and risk (likelihood of causing an incident).
4. **Estimate effort** — Provide rough effort estimates for remediation.
5. **Prioritise** — Rank items by business impact divided by effort.
6. **Recommend** — Propose a remediation plan that fits within [TIME_BUDGET].

Output a structured report with a summary table and detailed findings.

---

## Variations

### Dependency Audit

Analyse the dependency tree of `[CODEBASE_AREA]`:
- Outdated dependencies (current vs latest versions)
- Known security vulnerabilities (CVE references)
- Abandoned packages (no updates in 12+ months)
- Duplicate dependencies and licence compliance risks
Prioritise: security first, then upcoming breaking changes, then staleness.

### Pattern Inconsistency Analysis

Analyse `[CODEBASE_AREA]` for inconsistent patterns:
- Error handling (exceptions vs result types vs error codes)
- Data access (direct queries vs repositories vs ORMs)
- Configuration (env vars vs config files vs hardcoded values)
- Logging, naming conventions, and code organisation
For each, recommend which pattern to standardise on. Consider: [CONSTRAINTS]

### Test Coverage Gaps

Analyse test coverage in `[CODEBASE_AREA]`:
- Modules with low or no test coverage
- Critical business logic without integration tests
- Tests that pass but do not assert meaningful behaviour
- Areas requiring manual testing
Prioritise by: business criticality, change frequency, bug density.

---

## Tips

- Not all tech debt needs to be repaid — some is acceptable and intentional.
- Prioritise by business impact, not engineering aesthetics.
- Use the `/analyze` command to generate an initial codebase health report.
- The `architect` agent can map dependency graphs and identify coupling issues.
- Frame remediation in terms stakeholders care about: velocity and reliability.
- Track debt items in the backlog alongside feature work — invisible debt stays.
- Quick wins (high impact, low effort) build momentum and stakeholder trust.
- Pair debt remediation with feature work when the affected areas overlap.
