---
description: "Task list for 001-overdue-todo-items feature implementation"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, quickstart.md ✅
**Contracts**: None — no API changes required
**Tests**: Included — required by Constitution Principle II (Test-First Development)

**Organization**: Tasks grouped by story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no incomplete task dependencies)
- **[US1]**: Belongs to User Story 1

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the project builds and confirm the `utils/` directory is initialized. No new tooling or dependencies are required — the monorepo, Jest, and ESLint are already configured.

- [ ] T001 Confirm `npm install` is up to date and `npm test -- --watchAll=false` passes in `packages/frontend/` before making any changes (zero pre-existing failures baseline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `dateUtils.js` utility module and its tests. Nothing in User Story 1 can be implemented until this module exists and is verified correct.

**⚠️ CRITICAL**: T003 and T004 depend on T002. No US1 work can begin until this phase is complete.

- [ ] T002 Create `packages/frontend/src/utils/dateUtils.js` exporting `isOverdue(dueDate, completed)` and `formatDate(dateString)` — `isOverdue` uses `new Date(dueDate) < new Date(new Date().toDateString())` logic per data-model.md; `formatDate` extracted verbatim from `TodoCard.js`
- [ ] T003 Create `packages/frontend/src/utils/__tests__/dateUtils.test.js` with unit tests covering all `isOverdue()` truth-table branches (null dueDate → false, past date + incomplete → true, today's date + incomplete → false, future date → false, past date + completed → false) and `formatDate()` null/valid cases — verify tests pass

**Checkpoint**: `dateUtils.js` is tested and passing. User Story 1 implementation can now begin.

---

## Phase 3: User Story 1 — Visual Overdue Indicator (Priority: P1) 🎯 MVP

**Goal**: Incomplete todo items with a `dueDate` strictly before today render with a danger-red card border and an inline "Overdue" text label. Completed todos and todos without a due date are unaffected.

**Independent Test**: Add a mix of todos (overdue, due today, future, no-date, completed-past-due) to the running app and verify visually. All 4 acceptance scenarios in spec.md must pass.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Add overdue CSS rules to `packages/frontend/src/App.css`: `.todo-card--overdue { border-color: var(--danger-color); border-width: 2px; }` and `.overdue-label { color: var(--danger-color); font-size: 12px; font-weight: 600; margin-left: 8px; }` (auto-adapts to dark mode via CSS token)
- [ ] T005 [P] [US1] Add overdue rendering tests to `packages/frontend/src/components/__tests__/TodoCard.test.js`: (a) incomplete past-due todo renders `.todo-card--overdue` class and "Overdue" text, (b) completed past-due todo does NOT render overdue class or label, (c) todo with no dueDate does NOT render overdue class or label, (d) incomplete todo with today's date does NOT render overdue class or label
- [ ] T006 [US1] Update `packages/frontend/src/components/TodoCard.js`: (1) remove the `formatDate` function definition and replace with `import { isOverdue, formatDate } from '../utils/dateUtils'`, (2) add `todo-card--overdue` BEM modifier to card `<div>` className when `isOverdue(todo.dueDate, todo.completed)` is true, (3) render `<span className="overdue-label">Overdue</span>` inside the `todo-due-date` `<p>` element when overdue — depends on T002

**Checkpoint**: User Story 1 is fully functional and independently testable. All 4 acceptance scenarios from spec.md pass. Overdue indicator visible in both light and dark mode.

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T007 [P] Run `npm test -- --watchAll=false --coverage` in `packages/frontend/` and confirm all tests pass with ≥ 80% coverage (Constitution Principle II gate)
- [ ] T008 [P] Verify no ESLint errors in modified files: `packages/frontend/src/utils/dateUtils.js`, `packages/frontend/src/components/TodoCard.js`, `packages/frontend/src/App.css` (Constitution Principle III gate)

---

## Dependencies

```
T001 (baseline check)
  └─► T002 (create dateUtils.js)
        └─► T003 (unit test dateUtils)
              ├─► T004 [P] (CSS styles)       ← can start once T003 passes
              ├─► T005 [P] (TodoCard tests)   ← can start once T003 passes
              └─► T006 (update TodoCard.js)   ← depends on T002 (dateUtils exists)
                    └─► T007 [P] (full test run)
                    └─► T008 [P] (lint check)
```

**User Story completion order**: US1 is the only story. No inter-story dependencies.

---

## Parallel Execution Examples

### Once T003 is complete, run these in parallel:
- Agent A → T004 (CSS styles in `App.css`)
- Agent B → T005 (TodoCard tests in `TodoCard.test.js`)
- Agent C → T006 (TodoCard.js update — needs T002 dateUtils)

### Once T006, T004, T005 are complete, run these in parallel:
- Agent A → T007 (test run with coverage)
- Agent B → T008 (ESLint check)

---

## Implementation Strategy

**MVP scope**: The entire feature is a single P1 user story — implement all phases.

**Recommended order for a single developer**:
1. T001 → confirm baseline
2. T002 → write `dateUtils.js` implementation
3. T003 → write and run `dateUtils.test.js`, fix until green
4. T005 → write failing `TodoCard.test.js` overdue tests
5. T004 → add CSS rules (fast, unblocks dark-mode visual check)
6. T006 → update `TodoCard.js`, run tests until green
7. T007 + T008 → final verification gates

**Key constraints** (per plan.md):
- Do NOT add new npm dependencies
- Do NOT change any backend files
- Do NOT introduce new CSS color variables — use `--danger-color` only
- `formatDate` must be extracted (not duplicated) from `TodoCard.js`

---

## Format Validation

All tasks follow the required format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

| Task | Checkbox | ID | [P] | [Story] | File Path |
|------|----------|----|-----|---------|-----------|
| T001 | ✅ | ✅ | — | — (setup) | ✅ |
| T002 | ✅ | ✅ | — | — (foundational) | ✅ |
| T003 | ✅ | ✅ | — | — (foundational) | ✅ |
| T004 | ✅ | ✅ | ✅ | ✅ US1 | ✅ |
| T005 | ✅ | ✅ | ✅ | ✅ US1 | ✅ |
| T006 | ✅ | ✅ | — | ✅ US1 | ✅ |
| T007 | ✅ | ✅ | ✅ | — (polish) | ✅ |
| T008 | ✅ | ✅ | ✅ | — (polish) | ✅ |
