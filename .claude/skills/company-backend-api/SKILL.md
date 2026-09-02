---
name: company-backend-api
description: Backend implementation conventions for NestJS API work in this repository. Use for controllers, services, DTOs, Prisma access, validation, or API tests.
---

# Backend API change

Follow root and `apps/api/AGENTS.md` rules.

## Checklist

- Inspect the existing module pattern before creating files.
- Keep controllers thin: HTTP boundary only.
- Put business rules in services.
- Validate request input with DTOs and `class-validator`.
- Use client-safe errors and appropriate status codes.
- Update Swagger/OpenAPI annotations when contracts change.
- Keep Prisma access in backend services.
- Add a migration for schema changes.
- Add unit tests for business rules and e2e tests for HTTP behavior where relevant.

## Security review points

Check authentication/authorization boundaries, input trust, data exposure, logging, and error leakage.

If auth/authz, secrets, sensitive data, destructive migration, or security controls are affected, classify the change as high risk and require explicit human review.

## Verification

```bash
pnpm --dir apps/api lint
pnpm --dir apps/api test
pnpm --dir apps/api build
pnpm --dir apps/api test:e2e
```

Report contract changes, migration impact, tests, security impact, and compatibility concerns in the handoff.
