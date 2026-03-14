---
name: Code Refactoring
domain: code-quality
complexity: medium
works-with: [code-refactorer agent, /improve command]
---

# Code Refactoring Prompt

## When to Use

Use this prompt when you need to restructure existing code to improve its design, readability, or maintainability without changing its external behaviour.

## The Prompt

You are a senior software engineer performing a controlled refactoring.

**Target module:** `[MODULE_PATH]`

**Current issues:**
[CURRENT_ISSUES]

**Desired outcome:**
[DESIRED_OUTCOME]

**Constraints:**
[CONSTRAINTS]

Analyse the module and produce a step-by-step refactoring plan. For each step:
1. Describe the change and its rationale
2. Identify any behaviour that must be preserved
3. Specify which tests to run to verify correctness
4. Note any downstream modules that may be affected

Do not change external interfaces unless explicitly listed in the desired outcome.
After each step, confirm all existing tests pass before proceeding.

---

## Variations

### Extract Module

Analyse `[MODULE_PATH]` and identify responsibilities that should be extracted
into a separate module. The current module handles too many concerns:
[CURRENT_ISSUES]

Propose a clean boundary between the extracted and remaining code. Provide
the new module's public interface and migration steps. Preserve all existing
behaviour and ensure no circular dependencies are introduced.

### Simplify Complex Function

The function `[FUNCTION_NAME]` in `[MODULE_PATH]` has grown too complex:
[CURRENT_ISSUES]

Refactor it to reduce cyclomatic complexity below [TARGET_COMPLEXITY].
Techniques to consider: early returns, guard clauses, strategy pattern,
lookup tables, or decomposition into smaller private functions.
Maintain identical inputs/outputs and side effects.

### Migrate Pattern

Migrate `[MODULE_PATH]` from [OLD_PATTERN] to [NEW_PATTERN].
Current issues with the old pattern: [CURRENT_ISSUES]

Produce a migration plan that allows the old and new patterns to coexist
temporarily. Include a checklist for removing the old pattern once migration
is verified. Constraints: [CONSTRAINTS]

---

## Tips

- Always run the full test suite before starting so you have a known-good baseline.
- Make one logical change per commit — do not bundle unrelated improvements.
- Preserve observable behaviour; refactoring should not alter what the code does.
- If you discover a bug during refactoring, fix it in a separate change with its own test.
- Use the `/improve` command to get automated suggestions before manual work.
- When working with the `code-refactorer` agent, provide the module path and
  let it analyse dependencies automatically.
- Favour readability over cleverness — future maintainers will thank you.
- Document any intentional design decisions that are not obvious from the code.
- Consider feature flags if the refactoring is large enough to warrant incremental rollout.
