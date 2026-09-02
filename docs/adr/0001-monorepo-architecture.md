# ADR 0001: Full-stack monorepo architecture

## Status

Accepted for starter template.

## Context

The team needs a simple architecture that AI agents and humans can understand consistently.

## Decision

Use one pnpm monorepo with:

- `apps/web`: Vite + React
- `apps/api`: NestJS
- PostgreSQL through Prisma
- HTTP REST between frontend and backend

## Consequences

Benefits:

- one review surface
- simple local development
- consistent TypeScript tooling
- easy cross-layer feature changes

Trade-offs:

- frontend and backend share repository lifecycle
- repository CI can grow as the project grows

Do not split into microservices without a demonstrated operational/domain need.
