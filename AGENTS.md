# AGENTS.md

## Purpose

This repository is designed for AI-assisted engineering inside a human-controlled company workflow.

AI agents may inspect, plan, implement, test, review, document, and prepare pull requests. Humans remain accountable for approval, merge, release, and production decisions.

## Repository

```text
apps/web  -> Vite + React + TypeScript + Tailwind + shadcn/ui style primitives
apps/api  -> NestJS + Prisma + PostgreSQL
```

Package manager: **pnpm only**.

## Non-negotiable human-review rules

Agents must never:

- push directly to `main`
- merge a pull request
- approve their own work
- bypass required CI or CODEOWNERS
- disable branch protection, repository rules, or security checks
- commit credentials, tokens, `.env` secrets, or private customer data
- perform destructive production database operations
- weaken authentication, authorization, or data-protection controls without explicit human direction
- delete or skip tests only to make CI green

All substantial changes must end as reviewable work for a human.

## Required engineering loop

For substantial feature work:

1. Understand the ticket, existing code, relevant docs, and existing Compound Engineering artifacts.
2. Clarify requirements before coding when behavior is ambiguous.
3. Produce an implementation plan before broad changes.
4. Implement the smallest coherent change that satisfies the plan.
5. Simplify unnecessary abstraction and duplication.
6. Run the relevant local checks.
7. Perform automated code review and browser testing when applicable.
8. Capture reusable project learning.
9. Prepare a pull request with evidence, risk, migration impact, security impact, and rollback notes.
10. Stop for human review.

Compound Engineering is the preferred workflow layer:

```text
/ce-brainstorm
/ce-plan
/ce-work
/ce-simplify-code
/ce-code-review
/ce-test-browser
/ce-compound
```

AI review is supplemental and never counts as human approval.

## Architecture rules

- Frontend never connects directly to PostgreSQL.
- Backend owns authorization, validation, business rules, and data access.
- Keep NestJS controllers thin: `Controller -> Service -> Prisma`.
- Use Prisma migrations for schema changes.
- Use TanStack Query for server state in the frontend.
- Use Zustand only for client-only shared state when local React state is insufficient.
- Prefer existing shadcn/ui primitives before creating new UI primitives.
- Follow existing patterns before introducing new frameworks or abstractions.

## Quality gates

Before handoff, run the relevant commands from the repository root:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

For user-facing changes, browser-test the changed flow when browser tooling is available.

A task is not complete when TypeScript compiles; important behavior must be verified.

## Security and data

- Treat all external input as untrusted.
- Validate API DTOs at the backend boundary.
- Never rely on frontend guards for security.
- Never log passwords, tokens, secrets, or sensitive personal data.
- Do not expose raw stack traces or infrastructure errors to clients.
- Security-sensitive work requires explicit human review.

High-risk areas include authentication, authorization, payments, secrets, destructive migrations, CI/repository controls, infrastructure, and sensitive data flows.

## Git and pull requests

Work on feature branches. Keep commits reviewable and scoped.

Every PR should state:

- what changed and why
- linked requirement/ticket when available
- risk level
- test evidence
- database/migration impact
- security/privacy impact
- rollback plan
- known limitations or unresolved questions

Do not claim a change is "approved", "safe for production", or "ready to merge". Preferred final wording is:

> Automated implementation and checks are complete. Human review is required before merge.

## Scoped instructions

More specific rules exist in:

- `apps/api/AGENTS.md`
- `apps/web/AGENTS.md`

When working in those areas, follow both this file and the closest scoped instructions.
