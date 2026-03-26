# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-03-26 | **Spec**: [specs/001-overdue-todo-items/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

## Summary

Add a visual overdue indicator to incomplete todo items whose `dueDate` is strictly before the client's current local date. The indicator consists of a danger-red card border (CSS `--danger-color` token) and an inline `"Overdue"` text label next to the due date — satisfying WCAG AA via a dual color + text cue. No backend API or data-model changes are required; overdue state is computed purely at render time in a new `isOverdue()` utility function extracted to `packages/frontend/src/utils/dateUtils.js`.

## Technical Context

**Language/Version**: JavaScript ES2021+ / Node.js ≥ 16  
**Primary Dependencies**: React 18 (Create React App), Jest 27, @testing-library/react  
**Storage**: N/A — no persistence changes; overdue is a derived, ephemeral UI state  
**Testing**: Jest + @testing-library/react (frontend); no backend tests required  
**Target Platform**: Web browser (desktop-first, responsive to ≥ 320 px)  
**Project Type**: Web application — React frontend + Express.js backend (monorepo)  
**Performance Goals**: Overdue detection is synchronous pure-function computation; renders in < 1 ms per item  
**Constraints**: No new CSS color tokens; use existing `--danger-color` variable. No backend API changes. No new npm dependencies.  
**Scale/Scope**: Single-user; list size typically < 100 todos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Simplicity & SRP | `isOverdue()` extracted to `dateUtils.js`; `TodoCard` remains display-only | ✅ PASS |
| II. Test-First | Unit tests required for `isOverdue()` (all branches) and overdue rendering in `TodoCard.test.js` before implementation | ✅ PASS |
| III. Consistent Code Style | `camelCase` functions, `PascalCase` component, imports ordered, no new console statements | ✅ PASS |
| IV. Full-Stack Persistence via REST API | No backend changes; overdue is ephemeral client-side derived state — not persisted, not transmitted | ✅ PASS |
| V. Accessible, Themed UI | Uses `--danger-color` token (light `#c62828` / dark `#ef5350`); "Overdue" text label satisfies WCAG AA dual-cue; both themes verified | ✅ PASS |

**Gate result: ALL PASS — proceed to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

*(No contracts/ directory — this feature has no new or changed API contracts.)*

### Source Code

```text
packages/frontend/src/
├── utils/
│   └── dateUtils.js                         # NEW: isOverdue() + formatDate() (extracted from TodoCard)
├── utils/
│   └── __tests__/
│       └── dateUtils.test.js                # NEW: unit tests for isOverdue() and formatDate()
├── components/
│   └── TodoCard.js                          # MODIFIED: import isOverdue/formatDate, add overdue class + label
├── components/__tests__/
│   └── TodoCard.test.js                     # MODIFIED: add overdue indicator rendering tests
└── App.css                                  # MODIFIED: add .todo-card--overdue and .overdue-label styles
```

**Structure Decision**: Web application (monorepo). This feature touches only the frontend package. Backend package is unchanged.

## Complexity Tracking

*No constitution violations — section not required.*

## Phase 0: Research

*All unknowns resolved by code inspection and spec clarifications. No external research required.*

### Decisions

| Decision | Chosen | Rationale | Alternatives Rejected |
|----------|--------|-----------|----------------------|
| Date comparison implementation | `new Date(dueDate) < new Date(new Date().toDateString())` | `new Date().toDateString()` produces the local midnight boundary without a library; strictly-before-today semantics match spec FR-002/FR-007 | `Date.now()` compares with time (would mark items due earlier today as overdue); `date-fns` / `dayjs` (unneeded new dependency) |
| Where to put `isOverdue` logic | New `packages/frontend/src/utils/dateUtils.js` | SRP (Principle I): keeps `TodoCard` display-only; reusable across components; independently testable | Inline in `TodoCard.js` (violates SRP); separate hook (overkill — no React state needed) |
| Extract `formatDate` | Yes — move from `TodoCard.js` to `dateUtils.js` alongside `isOverdue` | DRY (Principle III): both functions are pure date utilities; colocating them avoids a split utility surface | Leaving `formatDate` in `TodoCard.js` (would create duplication if used elsewhere) |
| CSS approach | BEM modifier class `todo-card--overdue` on the card `<div>` | Matches existing class naming pattern (`todo-card`, `completed`); `--danger-color` CSS token auto-adapts in dark mode | Inline `style` prop (not testable, not themeable); new CSS file (overkill for 2 rules) |
| Overdue label element | `<span className="overdue-label">Overdue</span>` inside `todo-due-date` `<p>` | Dual cue (color + text) satisfies WCAG AA FR-005; minimal DOM change; screen-reader reads "Overdue" | Icon-only (fails WCAG AA text-cue requirement); badge in `todo-actions` (wrong location semantically) |
| Backend changes | None | Overdue is derived, ephemeral, and single-user — no server-side knowledge required | Returning `isOverdue` from API (would couple server to client's timezone/date) |

### Resolved Unknowns

- `isOverdue(dueDate, completed)` → `!completed && !!dueDate && new Date(dueDate) < new Date(new Date().toDateString())`
- `formatDate(dateString)` → existing implementation in `TodoCard.js` lines 54–60, extracted verbatim
- Dark-mode danger color: `--danger-color` = `#ef5350` (already in `theme.css` under `[data-theme="dark"]`)
- Existing `TodoCard` card `<div>` uses classes `todo-card` and `completed` (line 105) — same pattern for `todo-card--overdue`

