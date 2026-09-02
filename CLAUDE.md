# CLAUDE.md

## Mission

This repository uses AI as an engineering assistant inside a human-controlled software delivery process.

AI can analyze, plan, implement, test, review, document, and prepare pull requests.

A human reviewer owns approval and merge decisions.

## Architecture

```text
apps/web
  Vite + React + TypeScript + Tailwind + shadcn-style components
  TanStack Query for server state

apps/api
  NestJS + Prisma + PostgreSQL
```

Package manager: pnpm only.

## Mandatory human-control rules

Never:
- push directly to `main`
- merge a pull request
- approve your own work
- disable required CI checks
- remove CODEOWNERS protection
- weaken authentication/authorization/security controls without explicit human direction
- commit secrets
- silently rewrite database history
- delete tests only to make CI pass

All substantial work must end as reviewable changes for a human.

## Required development flow

For substantial work:

1. Understand existing code and relevant docs.
2. Use `/ce-brainstorm` if requirements are ambiguous or product behavior needs discovery.
3. Use `/ce-plan` before implementation.
4. Use `/ce-work` to implement the approved plan.
5. Use `/ce-simplify-code`.
6. Run local validation.
7. Use `/ce-code-review`.
8. Use `/ce-test-browser` for user-facing changes when available.
9. Use `/ce-compound` for reusable learnings.
10. Prepare a PR summary for human review.

Do not treat AI review as equivalent to human approval.

## Backend rules

Keep NestJS controllers thin.

Preferred flow:

```text
Controller -> Service -> Prisma
```

Controllers:
- parse HTTP inputs
- apply auth/authorization boundaries
- call services
- return API responses

Services:
- own business rules
- coordinate data access
- throw domain-appropriate errors

Validate every external input.

Use DTOs with `class-validator`.

Use global validation:

```ts
new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
})
```

Use Prisma migrations for schema changes.

Never edit production data/schema directly as part of a code change.

## Frontend rules

Use:
- TanStack Query for server state
- Zustand only for client-only global state
- local React state for component-local state

Do not copy API state into Zustand without a concrete reason.

Use shared UI primitives from `src/components/ui` before inventing alternatives.

Every async screen must handle:
- loading
- error
- empty
- success

## Security

Never log or commit:
- passwords
- tokens
- API keys
- credentials
- private customer data

Authorization must be enforced on the backend.

Frontend route guards are UX only.

## Testing

Before completion:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

For user-facing work, browser-test the changed flow when tooling is available.

Do not mark work complete with failing tests.

## Pull request expectation

Every PR should explain:
- what changed
- why
- risk level
- test evidence
- migration impact
- security impact
- rollback plan
- known limitations

High-risk changes require explicit human sign-off.
