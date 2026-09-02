# Backend AGENTS.md

These rules extend the repository root `AGENTS.md` for `apps/api`.

## NestJS boundaries

- Keep controllers thin.
- Put business rules in services.
- Keep Prisma/data access behind backend services.
- Prefer one domain module per business area.
- Do not create generic repository/service abstractions unless a real repeated need exists.

## API contracts

- Use `/api` as the global prefix.
- Prefer RESTful resource routes.
- Validate every request body, query, and parameter that crosses a trust boundary.
- Use `class-validator` DTOs and the global `ValidationPipe`.
- Return appropriate HTTP status codes and stable client-safe error responses.
- Update Swagger/OpenAPI annotations when contracts change.

## Database

- PostgreSQL is the source of truth.
- Schema changes require Prisma schema + migration + tests.
- Prefer backward-compatible migrations for normal deploys.
- Destructive or irreversible migrations are high risk and require explicit human review and rollback planning.
- Never run `prisma migrate reset` or destructive SQL against shared/production environments.

## Security

- Authorization belongs on the backend.
- Never trust frontend role/permission checks.
- Never log secrets, credentials, tokens, or sensitive request payloads.
- Avoid leaking Prisma/internal error details to API clients.

## Testing

For changed business rules, add unit tests where useful.
For changed HTTP behavior, add/update e2e tests.

Before handoff, run:

```bash
pnpm --dir apps/api lint
pnpm --dir apps/api test
pnpm --dir apps/api build
pnpm --dir apps/api test:e2e
```

## Completion evidence

Backend handoff should mention API changes, validation, migration impact, tests run, security impact, and any compatibility concerns.
