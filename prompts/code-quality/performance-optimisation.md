---
name: Performance Optimisation
domain: code-quality
complexity: high
works-with: [code-refactorer agent, /improve command]
---

# Performance Optimisation Prompt

## When to Use

Use this prompt when a module or system has measurable performance issues and you need a systematic approach to profiling, analysing, and optimising the bottleneck.

## The Prompt

You are a performance engineer. Analyse and optimise the following module.

**Target module:** `[MODULE_PATH]`

**Performance issue:**
[PERFORMANCE_ISSUE]

**Current metrics:**
[CURRENT_METRICS]

**Target metrics:**
[TARGET_METRICS]

Follow this process:
1. **Profile first** — Identify the actual bottleneck. Do not guess.
2. **Analyse** — Explain why the bottleneck exists and what contributes to it.
3. **Propose** — List optimisation options ranked by impact-to-effort ratio.
4. **Implement** — Apply the top-ranked optimisation with minimal code change.
5. **Benchmark** — Provide before/after measurements using the same workload.
6. **Validate** — Confirm all existing tests still pass and behaviour is unchanged.

Do not optimise code that is not on the critical path. Favour clarity over
micro-optimisation unless the target metrics demand otherwise.

---

## Variations

### Database Query Optimisation

Analyse database queries in `[MODULE_PATH]` causing: [PERFORMANCE_ISSUE]
Current: [CURRENT_METRICS] | Target: [TARGET_METRICS]

Investigate: query execution plans, N+1 patterns, unnecessary columns,
missing indexes, materialised views, and connection pool utilisation.
Provide optimised queries with EXPLAIN output comparisons.

### Algorithm Optimisation

The algorithm in `[MODULE_PATH]` has unacceptable complexity: [PERFORMANCE_ISSUE]
Current: [CURRENT_METRICS] | Target: [TARGET_METRICS]

For each alternative, state: time/space complexity (big-O), trade-offs,
edge cases where it may perform worse, and whether behaviour changes.

### Memory Usage Reduction

`[MODULE_PATH]` consumes excessive memory: [PERFORMANCE_ISSUE]
Current: [CURRENT_METRICS] | Target: [TARGET_METRICS]

Investigate: allocation patterns, data structure choices, caching/eviction
policies, streaming vs buffering, leaks from unclosed resources.

---

## Tips

- Never optimise without profiling first — intuition about bottlenecks is often wrong.
- Establish reproducible benchmarks before making any changes.
- Optimise the algorithm before optimising the implementation.
- Use the `/improve` command with performance focus for automated suggestions.
- The `code-refactorer` agent can apply mechanical optimisations like caching patterns.
- Document why an optimisation was chosen, especially if it reduces readability.
- Test with production-like data volumes — small test data hides scaling issues.
- Set up continuous performance monitoring to catch regressions early.
