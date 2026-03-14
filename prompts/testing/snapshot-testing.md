---
name: Snapshot Testing
domain: testing
complexity: low
works-with: [code-refactorer agent, /review command]
---

# Snapshot Testing

## When to Use

Use this prompt when you need to set up snapshot tests to catch unintended changes in component output, API responses, or configuration files.

## The Prompt

```
Set up snapshot tests for [COMPONENT_OR_OUTPUT] using [TEST_RUNNER] with
[SNAPSHOT_FORMAT] format.

Requirements:
- One snapshot per meaningful state or variant
- Descriptive snapshot names explaining what is captured
- Snapshot the smallest meaningful unit, not entire pages
- Exclude volatile data (timestamps, random IDs, build hashes)
```

## Variation 1 — Component Snapshots

```
Snapshot the [COMPONENT_OR_OUTPUT] React component for these states:
1. Default render with required props only
2. All optional props provided
3. Loading state
4. Error state
5. Empty state (no data)
Use inline snapshots for small output (under 30 lines), external files
for larger output. Mock dynamic values for deterministic results.
Target the meaningful container element, not the entire DOM tree.
```

## Variation 2 — API Response Snapshots

```
Snapshot [COMPONENT_OR_OUTPUT] API responses for: successful (typical),
successful (minimal), validation error (422), not found (404), and
paginated list with metadata. Normalise before snapshotting — replace
dynamic IDs with placeholders, fix timestamps to a constant, sort
object keys. These snapshots serve as a response contract.
```

## Variation 3 — Configuration Snapshots

```
Snapshot [COMPONENT_OR_OUTPUT] configuration output for: default config,
production environment, development environment, all features enabled,
and feature flags toggled. Exclude secrets, hostnames, and ports —
replace with placeholders. These snapshots catch unintended config drift.
```

## Tips

- **Snapshots are a safety net, not a specification.** They catch
  unintended changes but do not prove correctness. Pair with
  behavioural tests.
- **Review diffs carefully.** Treat every `--update-snapshot` as a code
  review. Blindly updating is the biggest risk with snapshot testing.
- **Keep snapshots small.** A 500-line snapshot is impossible to review.
  Snapshot fragments, not entire pages or responses.
- **Exclude volatile data.** Use custom serialisers to replace timestamps,
  IDs, and hashes with stable placeholders.
- **Know when NOT to snapshot.** Good for UI components, serialised output,
  and config files. Poor for complex logic or computed values.
- **Use `/review`** to have the `code-refactorer` agent check for overly
  large snapshots or missing states.
