# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`  
**Created**: 2026-03-26  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items — visually identify and distinguish overdue tasks in the todo list so users can prioritize work and quickly see which tasks are past their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator on Todo List (Priority: P1)

As a todo application user, I want overdue todos to be visually distinguished in my list so that I can immediately prioritize work and identify tasks that are past their due date without comparing dates manually.

**Why this priority**: This is the entire feature — without a visible overdue indicator there is no user value. All other potential stories (e.g., filtering by overdue) depend on this foundation.

**Independent Test**: Load the todo list containing a mix of todos (overdue, upcoming, no due date, completed-but-past-due). Verify overdue items are visually distinct without any other changes to the app.

**Acceptance Scenarios**:

1. **Given** a todo with a due date in the past and status incomplete, **When** the user views the todo list, **Then** the todo item is visually marked as overdue.
2. **Given** a todo with a due date in the future, **When** the user views the todo list, **Then** the todo item shows no overdue indicator.
3. **Given** a completed todo whose due date has already passed, **When** the user views the todo list, **Then** the todo item does NOT show an overdue indicator.
4. **Given** a todo with no due date set, **When** the user views the todo list, **Then** the todo item shows no overdue indicator.

---

### Edge Cases

- **No due date**: Todos without a due date are never overdue.
- **Completed past-due todo**: A completed todo is never overdue regardless of its due date.
- **Due date boundary**: A todo due *today* (same calendar date as the current local date) is **not** overdue. Overdue means `dueDate` is strictly before today's local date.
- **Timezone**: Date comparison uses the client's local date at render time.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST visually distinguish overdue todo items from non-overdue items in the todo list using a danger-red card border (design-system `danger` token) **and** a small inline "Overdue" text label rendered next to the due date string.
- **FR-002**: A todo item is overdue when its `dueDate` is strictly before today's local calendar date AND its `completed` status is `false`. A todo due on today's date is **not** overdue.
- **FR-003**: Todo items with no `dueDate` MUST NOT be marked as overdue.
- **FR-004**: Completed todo items MUST NOT be marked as overdue regardless of their `dueDate`.
- **FR-005**: The overdue visual indicator MUST meet WCAG AA color-contrast requirements and MUST NOT rely on color alone (an additional non-color cue such as an icon or label is required).
- **FR-006**: Overdue detection MUST be computed on the frontend at render time using the client's current local date; no backend API changes are required.
- **FR-007**: A todo due exactly today (same calendar day as the client's local date) is **not** overdue.

### Key Entities

- **Todo**: Existing entity — `id`, `title`, `dueDate` (optional ISO date string), `completed` (boolean), `createdAt`. Derived read-only state: `isOverdue` (computed from `dueDate` and `completed` at render time, not persisted).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify all overdue todos at a glance without reading or comparing any date values.
- **SC-002**: The overdue visual indicator passes WCAG AA contrast (≥ 4.5:1 for text, ≥ 3:1 for UI components).
- **SC-003**: Zero false positives — completed todos and no-due-date todos are never shown as overdue.
- **SC-004**: Zero false negatives — every incomplete todo with a past due date is shown as overdue.
- **SC-005**: The indicator renders correctly in both light and dark theme modes.

## Clarifications

### Session 2026-03-26

- Q: What visual treatment should be applied to overdue todo cards? → A: Danger-red card border + small "Overdue" text label next to the due date (uses existing `danger` design token; satisfies WCAG AA via dual color + text cue).
- Q: Is a todo due today (same calendar day) considered overdue? → A: No — overdue means strictly before today's local date; today is not overdue.

## Assumptions

- The existing `dueDate` field on the todo data model is sufficient; no schema or API changes are needed.
- Overdue state is ephemeral and computed purely on the client at render time — it is not stored or transmitted.
- The visual treatment uses the existing design system (Halloween-themed palette from `docs/ui-guidelines.md`); no new color tokens are introduced.
- Single-user application — no user-scoping or per-user timezone configuration is required.
- Mobile responsiveness follows existing patterns (the indicator does not require a new layout breakpoint).
