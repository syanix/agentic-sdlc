---
description: Improve code quality, performance, or maintainability
---

# /improve — Code Improvement Suite

Apply targeted improvements to your codebase using specialised agent chains. Select an improvement focus area to activate the appropriate agents and workflow.

## Usage

```
/improve [type] [target]
```

- **type**: `quality` | `performance` | `types` | `architecture` | `tests` (default: `quality`)
- **target**: File path, directory, or module (default: current working directory)

## Improvement Types & Agent Chains

### Code Quality
**Agent Chain**: Code Quality → Testing
1. Analyse code for smells, duplication, and complexity
2. Apply refactoring patterns (extract, inline, rename, simplify)
3. Improve error handling and edge case coverage
4. Update or add tests for refactored code

### Performance
**Agent Chain**: Backend Developer → Frontend Developer → Code Quality
1. Profile and identify bottlenecks (algorithmic, I/O, rendering)
2. Optimise data access patterns and queries
3. Reduce bundle size and improve load performance
4. Implement caching strategies where appropriate
5. Validate improvements do not degrade code quality

**Performance Targets:**
- Reduce unnecessary re-renders and computations
- Eliminate N+1 query patterns
- Minimise memory allocations in hot paths
- Improve time complexity where feasible

### Type Safety
**Agent Chain**: Code Quality → Architect
1. Identify weak or missing type definitions
2. Replace `any` types and implicit coercions
3. Add proper interfaces, enums, and type guards
4. Strengthen function signatures and return types
5. Validate type consistency across module boundaries

### Architecture
**Agent Chain**: Architect → Code Quality → Backend Developer
1. Analyse module dependencies and coupling
2. Identify violated boundaries and layering issues
3. Extract shared logic into appropriate abstractions
4. Improve separation of concerns
5. Align with established project patterns

### Test Coverage
**Agent Chain**: Testing → Code Quality
1. Analyse current coverage gaps
2. Identify critical untested paths and edge cases
3. Generate unit tests for uncovered functions
4. Add integration tests for key workflows
5. Validate test quality (not just coverage percentage)

## Improvement Workflow

1. **Analyse**: Scan target code and identify improvement opportunities
2. **Prioritise**: Rank improvements by impact and risk
3. **Plan**: Present proposed changes for approval before proceeding
4. **Implement**: Apply improvements incrementally
5. **Validate**: Run existing tests to ensure no regressions
6. **Report**: Summarise changes with before/after metrics

## Guidelines

- **Incremental changes**: Apply improvements in small, reviewable steps
- **No behaviour changes**: Unless explicitly requested, preserve existing functionality
- **Test first**: Ensure test coverage exists before refactoring
- **Measure impact**: Quantify improvements where possible
- **Respect patterns**: Follow established project conventions

## Output Format

```
## Improvement Report: [Type]
### Target: [path/module]

#### Changes Applied
1. [File] — [Description of change and rationale]
2. [File] — [Description of change and rationale]

#### Metrics
- [Relevant before/after measurements]
- [Coverage delta, complexity reduction, etc.]

#### Remaining Opportunities
- [Lower priority improvements not yet applied]

#### Regression Check
- Tests passing: YES/NO
- Behaviour preserved: YES/NO
```
