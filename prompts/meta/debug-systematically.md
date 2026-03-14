---
name: Debug Systematically
domain: meta
complexity: medium
works-with: [task-orchestrator agent, /analyze command]
---

# Debug Systematically

## When to Use

Use this prompt when you have a bug or unexpected behaviour and need a structured approach to reproduce, isolate, and fix the root cause.

## The Prompt

Help me debug the following issue systematically.

### Error Description

[ERROR_DESCRIPTION]

### Reproduction Steps

[REPRODUCTION_STEPS]

### Environment

[ENVIRONMENT]

### Recent Changes

[RECENT_CHANGES]

Follow this systematic debugging approach:

1. **Reproduce** - Confirm the issue using [REPRODUCTION_STEPS]. If intermittent,
   identify conditions that affect frequency. Record exact error and stack trace.

2. **Isolate** - Narrow scope using binary search: specific to [ENVIRONMENT]?
   Started with [RECENT_CHANGES]? Affects all users/data or specific cases?
   Can you reproduce with a minimal example?

3. **Hypothesise** - Form 2-3 ranked hypotheses. For each, state what evidence
   would confirm or refute it.

4. **Test** - Design the smallest possible test for each hypothesis. Test one
   variable at a time. Note expected results for correct vs wrong hypotheses.

5. **Fix** - Implement the minimal fix. Write a regression test. Check for the
   same pattern elsewhere. Document the root cause in the commit message.

6. **Prevent** - Can a linter rule catch this? Should a test be added to CI?
   Does documentation need updating? Is there a systemic cause?

## Variations

### Runtime Error Debugging

Focus on runtime exceptions and crashes. Start with the stack trace and work
backwards. Check for null references, type mismatches, concurrency issues,
and resource exhaustion. Examine recent dependency updates.

### Test Failure Investigation

Is the test wrong or the code? Check if the test previously passed (git bisect).
Look for flaky patterns: timing dependencies, shared state, environment
assumptions. Run the test in isolation to rule out ordering effects.

### Performance Regression

Compare metrics before and after [RECENT_CHANGES]. Profile CPU, memory, I/O,
and network. Look for N+1 queries, missing indices, memory leaks, and
unbounded data structures. Use flamegraphs to identify hotspots.

## Tips

- Use `git bisect` to find the exact commit that introduced the bug
- Resist the urge to fix the first thing that looks wrong - confirm causation
- Check logs at all layers: application, framework, infrastructure
- Rubber duck the problem - explaining it often reveals the answer
- If you have been stuck for 30 minutes, change your approach entirely
- Intermittent bugs often involve timing, caching, or shared mutable state
- Read the error message carefully - the answer is often in the detail
- Keep a debugging journal for the session to avoid circular investigation
