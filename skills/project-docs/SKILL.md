---
name: project-docs
description: Use this skill when you need to create, update, or manage project documentation including TODO lists, backlogs, changelogs, and archival workflows.
---

# Project Documentation Skill

Maintain consistent, actionable project documentation across TODO, BACKLOG, and CHANGELOG files.

## TODO.md Conventions

The TODO file is the **active work queue**. Every item must include priority, effort, and status.

### Format

```markdown
## TODO

| Priority | Effort | Status      | Description                          |
|----------|--------|-------------|--------------------------------------|
| P0       | S      | in-progress | Fix authentication bypass on /admin  |
| P1       | M      | todo        | Add pagination to list endpoints     |
| P2       | L      | blocked     | Migrate to new payment provider      |
| P3       | S      | todo        | Update footer copyright year         |
```

### Priority Levels

| Level | Meaning                          | SLA              |
|-------|----------------------------------|------------------|
| P0    | Critical — blocks release        | Address immediately |
| P1    | High — required for next release | This sprint      |
| P2    | Medium — planned work            | Next 2-3 sprints |
| P3    | Low — nice to have               | When capacity allows |

### Effort Sizing

| Size | Meaning                                    |
|------|--------------------------------------------|
| S    | Small — under 2 hours, single file change  |
| M    | Medium — half day, few files               |
| L    | Large — 1-2 days, multiple components      |
| XL   | Extra large — 3+ days, cross-cutting       |

### Status Values

- **todo** — Not yet started.
- **in-progress** — Actively being worked on.
- **blocked** — Cannot proceed; note the blocker inline.
- **done** — Completed; move to CHANGELOG then archive.

## BACKLOG.md

The BACKLOG holds **deferred items** that are not in the active sprint. Items here have been triaged but lack immediate priority.

### Structure

```markdown
## Backlog

### Enhancements
- [ ] Support bulk import via CSV upload
- [ ] Add dark mode toggle to settings

### Technical Debt
- [ ] Replace legacy ORM queries with query builder
- [ ] Consolidate duplicate validation logic

### Research
- [ ] Evaluate alternative search indexing strategies
- [ ] Spike: WebSocket vs SSE for real-time updates
```

### Rules
1. Items graduate from BACKLOG to TODO when prioritised for a sprint.
2. Review the backlog fortnightly; archive stale items older than 90 days.
3. Each item should be a single, actionable sentence.

## CHANGELOG.md

Follow the [Keep a Changelog](https://keepachangelog.com/) format.

### Structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- User profile avatar upload endpoint.

### Changed
- Increased default pagination limit from 20 to 50.

### Fixed
- Corrected timezone handling in scheduled reports.

## [1.2.0] - 2025-11-15

### Added
- Multi-tenancy support for organisation accounts.
```

### Categories (in order)
1. **Added** — New features.
2. **Changed** — Changes to existing functionality.
3. **Deprecated** — Features that will be removed.
4. **Removed** — Features that have been removed.
5. **Fixed** — Bug fixes.
6. **Security** — Vulnerability patches.

## Archival Workflows

### Completing a TODO item
1. Mark the item as **done** in TODO.md.
2. Add a corresponding entry under `[Unreleased]` in CHANGELOG.md.
3. Remove the item from TODO.md once the changelog is updated.

### Releasing a version
1. Move all `[Unreleased]` entries under a new version heading with today's date.
2. Review BACKLOG.md and promote any items now prioritised into TODO.md.
3. Commit the documentation updates alongside the release tag.

### Archiving stale backlog items
1. Items untouched for 90+ days should be moved to an `archive/` section at the bottom of BACKLOG.md.
2. Add a note with the archive date and reason (e.g., "Superseded by X" or "No longer relevant").
