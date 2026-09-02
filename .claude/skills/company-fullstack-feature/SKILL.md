---
name: company-fullstack-feature
description: Repository-specific checklist for implementing a full-stack feature across NestJS and Vite after requirements and a plan exist. Use when work touches both API and web layers.
---

# Full-stack feature implementation

Use this skill to execute repository conventions, not to replace Compound Engineering planning.

Before writing code, confirm there is a clear requirement and implementation plan. If not, use the Compound Engineering brainstorm/plan flow first.

## Implementation order

1. Identify the API contract and data model changes.
2. Implement backend validation and business behavior.
3. Add a Prisma migration if the schema changes.
4. Add/update backend tests.
5. Implement the typed frontend API integration.
6. Build the UI using existing shadcn/ui primitives.
7. Handle loading, error, empty, and success states.
8. Add/update focused frontend tests where valuable.
9. Browser-test the end-to-end user flow when tooling is available.

## Cross-layer checks

- Frontend must not encode security policy that belongs on the backend.
- Keep API contracts and frontend expectations synchronized.
- Do not expose raw infrastructure errors.
- Do not introduce a second state-management pattern.
- Avoid unrelated refactors in the same change.

## Verification

Run from repository root:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

After implementation, use automated review and then prepare a human handoff. Never self-approve or merge.
