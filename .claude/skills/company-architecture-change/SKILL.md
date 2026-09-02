---
name: company-architecture-change
description: Company procedure for changes that alter system boundaries, dependency direction, public API/data flows, trust boundaries, deployment topology, or major technology decisions. Use when architecture is changing or a durable decision needs an ADR.
---

# Architecture change procedure

Use this Skill when the change is more than ordinary implementation inside existing boundaries.

## Before implementation

1. Read `docs/ARCHITECTURE.md`.
2. Read relevant `docs/adr/` decisions.
3. Identify the exact boundary/flow/ownership being changed.
4. Identify alternatives and trade-offs.
5. Identify security, data, operational, migration, and rollback consequences.
6. Use `/ce-plan` for the implementation plan.
7. For high-impact architecture, stop for human plan/architecture review before broad implementation.

## Documentation

Update `docs/ARCHITECTURE.md` in the same PR when diagrams or described boundaries change.

Create an ADR from `docs/adr/0000-template.md` when the decision is durable/significant or has meaningful alternatives.

Do not create an ADR for every small refactor.

## Review

Before handoff, use `architecture-reviewer` and, when security/trust boundaries changed, `security-reviewer`.

The handoff must explicitly state:

- old architecture/boundary
- new architecture/boundary
- why the change was chosen
- migration/rollout path
- rollback/exit strategy
- operational/security consequences
- human decisions still required

AI may recommend an architecture. A human technical owner remains accountable for accepting major architecture decisions.
