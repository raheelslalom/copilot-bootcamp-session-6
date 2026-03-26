# Data Model: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Date**: 2026-03-26

## Entities

### Todo (existing — no schema changes)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | integer | yes | Auto-assigned by backend |
| `title` | string (max 255) | yes | Display text |
| `dueDate` | string (ISO 8601 date, `YYYY-MM-DD`) \| `null` | no | Optional; `null` means no due date |
| `completed` | integer (0 \| 1) | yes | `0` = incomplete, `1` = complete |
| `createdAt` | string (ISO 8601 datetime) | yes | Set by backend at creation |

**No new fields, no schema migrations, no API changes.**

---

## Derived State (client-side, not persisted)

### `isOverdue`

A boolean derived at render time from two existing Todo fields. It is **never stored on the server** and **never sent over the API**.

**Definition:**
```
isOverdue(dueDate, completed) =
  !completed          // todo must be incomplete
  && dueDate !== null // todo must have a due date
  && new Date(dueDate) < new Date(new Date().toDateString())
                      // dueDate is strictly before today's local midnight
```

**Truth table:**

| `dueDate` | `completed` | Today's date | `isOverdue` |
|-----------|-------------|--------------|-------------|
| `null` | `0` | any | `false` |
| `"2026-03-25"` | `0` | 2026-03-26 | `true` |
| `"2026-03-26"` | `0` | 2026-03-26 | `false` (today is not overdue) |
| `"2026-03-27"` | `0` | 2026-03-26 | `false` |
| `"2026-03-25"` | `1` | 2026-03-26 | `false` (completed) |

---

## Utility: `dateUtils.js`

**Location**: `packages/frontend/src/utils/dateUtils.js`

### `isOverdue(dueDate, completed)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `dueDate` | `string \| null \| undefined` | ISO 8601 date string from todo entity, or absent |
| `completed` | `number \| boolean` | `0`/`false` = incomplete, `1`/`true` = complete |

**Returns**: `boolean` — `true` only when the todo is incomplete and its due date is strictly before today.

### `formatDate(dateString)`

Extracted from `TodoCard.js` (existing logic, no behavior change).

| Parameter | Type | Description |
|-----------|------|-------------|
| `dateString` | `string \| null \| undefined` | ISO 8601 date or falsy |

**Returns**: `string | null` — locale-formatted date (e.g., `"March 25, 2026"`) or `null` for absent dates.

---

## State Transitions

```
Todo [dueDate set, incomplete]
  │
  ├─ dueDate < today  ──► isOverdue = true   ──► card renders with overdue indicator
  ├─ dueDate = today  ──► isOverdue = false  ──► card renders normally
  ├─ dueDate > today  ──► isOverdue = false  ──► card renders normally
  └─ user marks complete ──► isOverdue = false (regardless of date)
```

---

## Validation Rules

| Rule | Source |
|------|--------|
| `isOverdue` MUST be `false` when `completed` is truthy | FR-004 |
| `isOverdue` MUST be `false` when `dueDate` is absent/null | FR-003 |
| A todo due on today's local date MUST NOT be `isOverdue` | FR-007 |
| Date comparison MUST use the client's local time zone | Spec edge-case (Timezone) |
