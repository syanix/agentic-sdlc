---
name: State Management
domain: frontend
complexity: high
works-with: [architect agent, /feature command]
---

# State Management Prompt

## When to Use

Use this prompt when you need to set up a scalable state management architecture that separates server state from client state.

## The Prompt

```
Set up state management for a [FRAMEWORK] application with these requirements:

**State library:** [STATE_LIBRARY]

**Data domains to manage:**
[DATA_DOMAINS]

**Async requirements:**
[ASYNC_REQUIREMENTS]

**Architecture rules:**
1. Separate server state (data fetched from APIs) from client state (UI preferences, form drafts, local toggles)
2. Server state must handle: loading, error, stale, and fresh states explicitly
3. Client state must be initialised from sensible defaults, not undefined
4. Never duplicate server data into client state -- derive views via selectors
5. Keep state as close to where it is used as possible (colocate)
6. Only promote state to global when two or more unrelated components need it
7. All state mutations must be traceable -- use named actions/events, not anonymous setters

**Conventions:**
- One store/slice per data domain (do not lump everything into a single store)
- Selectors must be memoised to prevent unnecessary re-renders
- Side effects (API calls, localStorage sync) must be isolated from pure state transitions
- Include TypeScript types for all state shapes and actions
- Add dev-tools integration for debugging (Redux DevTools, TanStack Query DevTools, etc.)

**Folder structure:**
- stores/[domain]/[domain].store.ts (state definition and mutations)
- stores/[domain]/[domain].selectors.ts (derived data)
- stores/[domain]/[domain].types.ts (TypeScript interfaces)
- stores/[domain]/[domain].test.ts (unit tests)

Generate the store setup, one complete domain implementation, selectors, types, and tests.
```

## Variations

### Server-State Focus (TanStack Query / SWR)
Add to the prompt:
```
Primary state tool is [TANSTACK_QUERY | SWR]. Configure:
- Default stale time: [STALE_TIME]ms
- Default cache time: [CACHE_TIME]ms
- Retry strategy: 3 retries with exponential backoff
- Query key factory pattern: one file exporting all query keys per domain
- Prefetch critical data in route loaders or layout components
- Optimistic updates for mutations with rollback on error
- Global error handler that shows toast notifications for failed queries
```

### Client-State Focus (Zustand / Pinia / Signals)
Add to the prompt:
```
Primary state tool is [ZUSTAND | PINIA | SIGNALS]. Configure:
- Persist [PERSISTED_SLICES] to localStorage with versioned migration strategy
- Implement undo/redo for [UNDOABLE_DOMAINS] using an action history stack
- Add middleware for logging state transitions in development
- Expose subscribe API for non-component consumers (e.g. analytics, WebSocket handlers)
- Reset store to initial state on user logout
```

### Hybrid Approach
Add to the prompt:
```
Use both server-state and client-state libraries together:
- Server state: [SERVER_STATE_LIBRARY] for all API data
- Client state: [CLIENT_STATE_LIBRARY] for UI state and user preferences
- Define clear boundaries: if data comes from an API, it lives in server-state
- Create a shared types package that both layers reference
- Document the decision boundary in a short ADR (Architecture Decision Record)
```

## Tips

- **State colocation prevents complexity.** Before making state global, ask: "Does any component outside this subtree need this?" If no, keep it local. Moving state up is easy; untangling global state later is not.
- **Avoid over-centralisation.** Not every piece of data needs a store. URL params, form state, animation state, and ref values are not store material.
- **Server state is not your state.** You are caching someone else's data. Treat it that way -- set expiry, handle staleness, and always be ready for the server to disagree with your cache.
- **Test selectors in isolation.** Give a selector a known state shape and assert the output. This is where most state bugs hide -- in the derivation, not the storage.
