<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Principles added:
  - I. Simplicity & Single Responsibility (new)
  - II. Test-First Development (new)
  - III. Consistent Code Style (new)
  - IV. Full-Stack Persistence via REST API (new)
  - V. Accessible, Themed UI (new)
Sections added:
  - Technology Stack
  - Development Workflow
Sections removed: none
Templates reviewed:
  - .specify/templates/plan-template.md    ✅ no changes required (Constitution Check gate is generic)
  - .specify/templates/spec-template.md   ✅ no changes required
  - .specify/templates/tasks-template.md  ✅ no changes required
Follow-up TODOs: none — all placeholders resolved.
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Simplicity & Single Responsibility

Every module, component, and function MUST have a single, well-defined responsibility.
Simple solutions MUST be preferred over complex ones. Premature optimization is
prohibited — write clear, readable code first and optimize only when a measured
performance problem exists.

- Functions MUST do one thing and do it well.
- React components MUST handle display or data, not both.
- Complex logic MUST be broken into small, named helper functions.
- YAGNI: do not add capabilities until they are needed.

*Rationale*: Consistent with the KISS and SRP principles in `docs/coding-guidelines.md`.
Simpler code is easier for Copilot-assisted development, review, and onboarding.

### II. Test-First Development (NON-NEGOTIABLE)

Tests MUST be written as part of development — not as an afterthought.
The project MUST maintain 80 % or higher code coverage across all packages.

- Unit tests MUST cover individual components, functions, and route handlers in isolation.
- Integration tests MUST cover component interactions and frontend-to-backend API communication.
- End-to-end tests are out of scope for this project.
- All tests MUST use Jest; React components additionally use `@testing-library/react`.
- Test files MUST be placed in `__tests__/` directories colocated with the source files they cover.
- Test file names MUST follow the pattern `{filename}.test.js`.
- Tests MUST be independent: no shared mutable state between test cases.
- External dependencies (API calls, timers) MUST be mocked in unit tests.

*Rationale*: Derived from `docs/testing-guidelines.md`. High coverage and isolation
protect against regressions during bootcamp-paced iteration.

### III. Consistent Code Style

All code MUST conform to the project's naming and formatting conventions enforced by ESLint.

- **Indentation**: 2 spaces (no tabs).
- **Variables & functions**: `camelCase`.
- **Constants**: `UPPER_SNAKE_CASE`.
- **React components & classes**: `PascalCase`; file name MUST match component name.
- **Imports**: ordered — (1) external libraries, (2) internal modules, (3) CSS — with a
  blank line separating each group. Circular imports are prohibited.
- **DRY**: repeated logic MUST be extracted into shared utilities or reusable components.
- **No `console` statements** in production code paths (ESLint warning enforced).
- All linting errors MUST be resolved before opening a pull request.

*Rationale*: Derived from `docs/coding-guidelines.md`. Consistent style reduces
cognitive load and keeps Copilot suggestions predictable and correct.

### IV. Full-Stack Persistence via REST API

All application state changes MUST be persisted immediately through the Express.js
backend API. Client-side-only state for todo data is prohibited.

- The React frontend MUST communicate with the backend for every CRUD operation on todos.
- The Express.js API is the single source of truth for todo data.
- No database schema changes beyond basic todo storage are permitted.
- The application is single-user: no authentication, authorization, or user-scoping
  is required or permitted (out of scope).
- API communication errors MUST be caught and surfaced to the user with a clear message.

*Rationale*: Derived from `docs/functional-requirements.md` and `docs/project-overview.md`.
Ensures data durability across page refreshes and keeps the architecture honest.

### V. Accessible, Themed UI

The UI MUST follow the Halloween-themed Material Design-inspired design system defined in
`docs/ui-guidelines.md` and MUST meet WCAG AA accessibility standards.

- **Color**: Use the defined light/dark palette (primary `#ff6b35`/`#ff8c42`,
  accent `#9d4edd`/`#bb86fc`) — do not introduce arbitrary colors.
- **Spacing**: All spacing MUST align to the 8 px grid (`xs=8px`, `sm=16px`,
  `md=24px`, `lg=32px`, `xl=48px`).
- **Typography**: Use the system font stack; follow defined size/weight hierarchy.
- **Dark/light mode**: Toggle MUST persist the user's preference in `localStorage`
  and default to the system preference on first visit.
- **Accessibility**: All interactive elements MUST be keyboard-navigable; color contrast
  MUST meet WCAG AA; icon buttons MUST have descriptive `aria-label` attributes.
- **Responsiveness**: Layout MUST be usable at mobile (≥ 320 px) through desktop
  (max content width 600 px).

*Rationale*: Derived from `docs/ui-guidelines.md`. Consistency and accessibility are
non-negotiable in a production-quality bootcamp deliverable.

## Technology Stack

This project is a JavaScript monorepo managed with npm workspaces.

| Layer     | Technology              | Notes                              |
|-----------|-------------------------|------------------------------------|
| Frontend  | React (Create React App) | `packages/frontend/`              |
| Backend   | Node.js + Express.js    | `packages/backend/`               |
| Testing   | Jest + @testing-library/react | Both packages                |
| Package   | npm workspaces          | Root `npm run start` / `npm test` |

- Node.js ≥ 16 and npm ≥ 7 are REQUIRED.
- No additional runtime databases or external services are in scope.

## Development Workflow

- Run `npm install` at the repository root to install all workspace dependencies.
- Run `npm run start` from the root to start both frontend (port 3000) and backend (port 3001).
- Run `npm test` from the root to execute all tests across all packages.
- Lint MUST be verified clean before committing; address all ESLint errors and warnings.
- Pull requests MUST pass all tests and maintain ≥ 80 % coverage before merging.
- Branch strategy: feature work on `feature/*` branches, merged to `main` via PR.

## Governance

This constitution supersedes all informal conventions. Any deviation requires an amendment.

- **Amendments**: Propose changes via pull request with rationale; update the version line
  following semantic versioning (`MAJOR.MINOR.PATCH`); update `Last Amended` date.
- **Compliance review**: Every PR description MUST confirm the five Core Principles are met.
- **Versioning**:
  - MAJOR — principle removal, incompatible governance change.
  - MINOR — new principle or materially expanded guidance.
  - PATCH — wording clarifications, typo fixes, non-semantic refinements.
- Reference `docs/coding-guidelines.md`, `docs/testing-guidelines.md`, and
  `docs/ui-guidelines.md` for detailed implementation guidance.

**Version**: 1.0.0 | **Ratified**: 2026-03-26 | **Last Amended**: 2026-03-26
