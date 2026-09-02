---
name: company-db-migration
description: Safe PostgreSQL and Prisma migration procedure for this repository. Use whenever a change alters Prisma schema, database structure, indexes, constraints, or migration files.
---

# Database migration procedure

Database changes are review-sensitive and must be explicit.

## Before changing schema

- Identify the application behavior requiring the change.
- Inspect existing Prisma schema and migrations.
- Classify the migration as additive/backward-compatible or destructive/high-risk.
- For high-risk changes, stop for human plan approval before destructive operations.

## Implementation

1. Update `schema.prisma`.
2. Create a migration; do not hand-edit migration history to hide problems.
3. Inspect generated SQL.
4. Consider existing data, nullability, defaults, constraints, indexes, and deploy ordering.
5. Update backend code and tests.
6. Update frontend/API consumers if the contract changes.

## Forbidden autonomous actions

Never run destructive production SQL, `prisma migrate reset` on shared environments, drop production data, or rewrite deployed migration history.

## Handoff evidence

State:

- exact schema change
- whether it is backward-compatible
- expected lock/data-risk considerations
- deploy order if relevant
- rollback/forward-fix approach
- tests performed

Human approval is mandatory before destructive or irreversible migration execution.
