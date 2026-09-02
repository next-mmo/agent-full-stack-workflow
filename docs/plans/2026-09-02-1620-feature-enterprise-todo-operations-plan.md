---
title: "Enterprise Todo Operations - Plan"
type: feature
date: 2026-09-02
origin: "user request in AI-assisted starter bootstrap"
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# Enterprise Todo Operations - Plan

## Goal Capsule

- **Objective:** Exercise the repository's real full-stack AI workflow with a non-trivial but reviewable feature that crosses database, NestJS API, React UI, tests, CI, and knowledge capture.
- **Means:** Extend Todo with priority and due date, add server-side search/filter/pagination, and add an operational health endpoint without introducing auth or unrelated infrastructure.
- **Authority:** Repository `AGENTS.md`, scoped app instructions, human-review policy, and this plan govern implementation. Human approval remains the merge gate.
- **Execution profile:** One PR with additive migration, backend contract changes, frontend integration, targeted tests, full CI, review, and compound learning.
- **Stop conditions:** Do not add authentication, multi-tenancy, background jobs, destructive schema migration, or production deployment automation in this unit of work.
- **Tail ownership:** Automated work may prepare and validate the PR; a human reviewer owns approval and merge.

## Product Contract

### Summary

Make the Todo sample resemble a real internal work queue rather than a toy CRUD screen while keeping the scope small enough to review. Users can set priority and optional due date, search and filter the work queue, page through results, and operations can probe a health endpoint.

### Requirements

- R1. Todo records support `LOW`, `MEDIUM`, and `HIGH` priority with `MEDIUM` as the backward-compatible default.
- R2. Todo records support an optional due date.
- R3. The list API supports bounded pagination plus optional text search, completed-state filter, and priority filter.
- R4. The list API returns explicit pagination metadata rather than an unbounded array.
- R5. The web UI can create todos with priority and optional due date and can search/filter the queue.
- R6. The web UI presents loading, error, empty, and populated states and allows moving between pages.
- R7. Existing toggle-complete and delete behavior continue to work.
- R8. The API exposes a lightweight health endpoint suitable for service/liveness checks without leaking secrets or infrastructure details.
- R9. Validation rejects unsupported priority values, invalid dates, invalid booleans, and out-of-range page sizes.
- R10. The feature ships with backend unit/e2e coverage and frontend tests for pure query/format behavior where practical; CI must pass before human review.

### Scope Boundaries

- **In:** additive Todo fields, Prisma migration, list-query DTO, paginated contract, UI controls, health endpoint, tests, CE plan/learning artifacts.
- **Out:** login, users/teams, permissions, notifications, recurring todos, file attachments, realtime updates, external search engine, deployment infrastructure.
- **Deferred:** authenticated actor/audit trail. Audit events without real identity would teach the wrong production pattern, so they are intentionally excluded until auth exists.

### Key Decisions

- KD1. Preserve `completed` instead of replacing it with a new status enum. This keeps the migration additive and avoids a breaking semantic conversion during a workflow demonstration. Governs R3, R7.
- KD2. Add `priority` and `dueDate` directly to `Todo`; do not add a separate metadata table. The current domain does not justify additional relational complexity. Governs R1, R2.
- KD3. Use offset pagination with a hard maximum page size for this starter. Cursor pagination is deferred until data volume or ordering requirements justify it. Governs R3, R4, R9.
- KD4. Health is intentionally a liveness-style endpoint that reports service status and timestamp only. Database readiness can be added later with explicit operational semantics. Governs R8.

### Sources

- Root and scoped `AGENTS.md` files in this repository.
- EveryInc Compound Engineering `ce-plan` contract: implementation-ready plans use stable U-IDs, scope boundaries, per-unit test scenarios, and verification contracts.
- Existing Todo API/UI patterns in `apps/api/src/todos` and `apps/web/src/features/todos`.

## Planning Contract

### Key Technical Decisions

- KTD1. Prisma receives an enum-backed `priority` field defaulting to `MEDIUM`, an optional `dueDate`, and indexes that support common completed/priority ordering without prematurely indexing free-text title search.
- KTD2. `GET /api/todos` returns `{ items, page, pageSize, total, totalPages }`. Query validation caps `pageSize` at 50 and defaults to 20.
- KTD3. Search uses Prisma case-insensitive `contains` on title. This is adequate for a starter and avoids introducing a search service.
- KTD4. The frontend query key includes search, completed, priority, and page so TanStack Query owns server-state caching correctly.
- KTD5. Create/update DTOs use ISO-8601 date validation and priority enum validation at the API boundary.
- KTD6. Health uses a dedicated module/controller rather than hiding operations behavior in the Todo controller.

### Assumptions

- The starter is single-user demo data; authorization is outside this feature.
- PostgreSQL is available in CI through the existing service container.
- Existing rows receive `MEDIUM` priority and null due date through an additive migration.

### Patterns to Follow

- `Controller -> Service -> Prisma` in the API.
- TanStack Query for API state in the web app.
- shadcn-compatible primitives from `apps/web/src/components/ui`.
- Existing GitHub CI as the objective completion gate before human review.

## Implementation Units

### U1. Add backward-compatible Todo planning fields

- **Goal:** Existing and new Todo rows have priority plus optional due date without data loss.
- **Requirements:** R1, R2.
- **Dependencies:** none.
- **Files:** Prisma schema and one additive migration; create/update DTOs.
- **Test scenarios:**
  - Happy path: create a Todo with `HIGH` priority and valid due date; persisted response returns both values.
  - Backward compatibility: create without priority/due date; response uses `MEDIUM` and null.
  - Error path: unsupported priority or invalid date receives HTTP 400.
- **Verification:** migration deploys against empty CI DB and API validation tests pass.

### U2. Add bounded search/filter/pagination API

- **Goal:** `GET /api/todos` is bounded and queryable for realistic queue use.
- **Requirements:** R3, R4, R9.
- **Dependencies:** U1.
- **Files:** list-query DTO, controller, service, unit/e2e tests.
- **Test scenarios:**
  - Happy path: page 1 with pageSize 2 returns two items plus correct total metadata.
  - Filter: `completed=true` only returns completed rows.
  - Filter: `priority=HIGH` only returns high-priority rows.
  - Search: case-insensitive title fragment returns matching rows.
  - Edge: pageSize above 50 receives HTTP 400.
  - Edge: malformed completed value receives HTTP 400.
- **Verification:** service query options and HTTP contract are covered.

### U3. Upgrade the work-queue UI

- **Goal:** Users can create prioritized/due work and search/filter/page through server results.
- **Requirements:** R5, R6, R7.
- **Dependencies:** U1, U2.
- **Files:** frontend API types/client, Todo page, small UI primitives if missing, frontend tests.
- **Test scenarios:**
  - Create: title + HIGH + due date sends the expected request.
  - Query: changing search/priority/completed resets or uses page 1 and changes the TanStack Query key.
  - Empty: no matching items shows an explicit empty result state.
  - Existing behavior: toggling completion and delete still invalidate the list query.
  - Pagination: previous/next controls respect page bounds and metadata.
- **Verification:** frontend lint/test/typecheck/bundle plus browser test when available.

### U4. Add operational health endpoint

- **Goal:** Operators and automation have a stable, non-sensitive liveness endpoint.
- **Requirements:** R8.
- **Dependencies:** none.
- **Files:** health module/controller and e2e test.
- **Test scenarios:**
  - `GET /api/health` returns 200 with `status: "ok"` and an ISO timestamp.
  - Response contains no environment variables, database URL, host secrets, or stack details.
- **Verification:** e2e test plus API build.

### U5. Run review, CI, and institutional-memory capture

- **Goal:** Prove the repository workflow rather than merely document it.
- **Requirements:** R10.
- **Dependencies:** U1-U4.
- **Files:** CI fixes only if needed; `docs/solutions/` learning for non-trivial verified workflow/tooling issues.
- **Test scenarios:**
  - CI executes dependency install, migrations, API/web lint, API/web tests, API/web builds, and API e2e.
  - Automated reviewer findings are surfaced as evidence and do not replace human approval.
  - Non-trivial verified setup/CI learning is captured under `docs/solutions/`.
- **Verification:** GitHub Actions is green on the PR head and the PR remains unmerged awaiting human review.

## Verification Contract

Required automated gate:

```text
Prisma migration deploy
API lint
Web lint
API unit tests
Web tests
API build
Web typecheck
Web bundle
API e2e
```

Manual/agent-assisted user-flow evidence when browser tooling is available:

```text
Create HIGH priority todo with due date
Search for it
Filter HIGH
Toggle completed
Filter completed
Move between pages when enough data exists
Delete it
```

## Definition of Done

- R1-R10 are implemented or any exception is explicitly documented.
- Migration is additive and deploys successfully.
- List endpoint is bounded and validated.
- Frontend consumes the paginated contract and preserves Todo mutations.
- Health endpoint is non-sensitive.
- CI is green on the PR head.
- At least one real reusable learning from the exercised workflow is captured when verified.
- PR remains subject to human review and merge.
