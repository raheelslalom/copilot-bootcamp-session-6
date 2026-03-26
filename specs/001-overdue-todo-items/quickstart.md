# Quickstart: Overdue Todo Indicator

**Feature**: `001-overdue-todo-items`

## Prerequisites

- Node.js ≥ 16, npm ≥ 7
- Repository cloned and dependencies installed: `npm install` (from repo root)

## Running the App

```bash
# From repo root — starts frontend (port 3000) and backend (port 3001)
npm run start
```

## Verifying the Feature

### 1. Create an overdue todo

Open `http://localhost:3000` and add a todo with a due date in the past (e.g., yesterday's date). The todo should immediately appear in the list with:

- A **danger-red card border**
- An **"Overdue"** label displayed next to the due date

### 2. Create a non-overdue todo

Add a todo with a due date set to **today** or in the future. The card should render with the standard border and **no** "Overdue" label.

### 3. Create a todo with no due date

Add a todo without a due date. It should **never** show an overdue indicator.

### 4. Complete an overdue todo

Mark an overdue todo as complete (check the checkbox). The overdue indicator should **disappear** immediately after the toggle.

### 5. Verify dark mode

Click the sun/moon theme toggle in the top-right corner. The overdue card border and label should render in the dark-mode danger red (`#ef5350`) without losing contrast.

## Running Tests

```bash
# Run all frontend tests
cd packages/frontend && npm test

# Run with coverage
cd packages/frontend && npm test -- --coverage
```

Key test files:
- `packages/frontend/src/utils/__tests__/dateUtils.test.js` — unit tests for `isOverdue()` and `formatDate()`
- `packages/frontend/src/components/__tests__/TodoCard.test.js` — rendering tests for the overdue indicator

## Key Files Changed

| File | Change |
|------|--------|
| `packages/frontend/src/utils/dateUtils.js` | NEW — `isOverdue()` + `formatDate()` utilities |
| `packages/frontend/src/utils/__tests__/dateUtils.test.js` | NEW — unit tests |
| `packages/frontend/src/components/TodoCard.js` | MODIFIED — imports utilities, adds `todo-card--overdue` class and `<span class="overdue-label">Overdue</span>` |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | MODIFIED — adds overdue rendering tests |
| `packages/frontend/src/App.css` | MODIFIED — adds `.todo-card--overdue` and `.overdue-label` styles |
