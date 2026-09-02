# Contributing

This repository uses human-reviewed AI-assisted engineering.

## Before work starts

1. Identify the ticket/requirement and owner.
2. Read `docs/ARCHITECTURE.md` and root `AGENTS.md`.
3. Read the closest scoped `AGENTS.md` for the area being changed.
4. Read relevant ADRs/plans/solutions.
5. Load explicitly referenced Jira/Figma context when approved and available.
6. Clarify ambiguous product/security behavior before implementation.

For substantial work, use the Compound Engineering flow documented in `docs/WORKFLOW.md`.

## Branches

Work on a short-lived branch from current `main`.

Suggested names:

```text
feat/<ticket>-short-name
fix/<ticket>-short-name
chore/<short-name>
```

Do not push directly to protected `main`.

## Development

Use pnpm only.

```bash
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

`pnpm-lock.yaml` is committed and is part of the reviewed dependency contract.

When intentionally changing dependencies, update the manifest and lockfile together with pnpm. Never delete/regenerate the lockfile merely to hide a resolution problem.

## Architecture changes

Update `docs/ARCHITECTURE.md` when changing boundaries, dependency direction, public flows, trust boundaries, deployment topology, or delivery gates.

Add/update an ADR for significant durable decisions with meaningful alternatives/trade-offs.

Use `docs/adr/0000-template.md` as the template.

## Tests

Follow `docs/TESTING.md`.

Before handoff run the relevant commands:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

User-facing changes should include browser verification when applicable.

## Pull requests

A PR must be understandable without requiring the reviewer to reconstruct the entire task from chat history.

Include:

- summary and intent
- linked Jira/requirement and Figma reference when applicable
- architecture impact and ADR/docs impact
- validation evidence
- database/migration impact
- security/privacy impact
- dependency/supply-chain impact
- release/operations impact when applicable
- risk level
- rollback plan
- unresolved questions

AI-assisted implementation/review must be disclosed in the PR template.

## Reviews

AI reviewers are advisory quality signals.

A human reviewer is required for every PR. Domain/CODEOWNER/security review is required where policy says so.

Authors and AI agents must not self-approve or merge around required controls.

## Dependencies

Avoid adding dependencies when the platform/standard library/existing dependency already solves the need cleanly.

For a new dependency, reviewers should consider:

- maintenance/activity
- security history
- license/company policy
- runtime/bundle impact
- transitive dependency impact
- whether the functionality is actually necessary

Dependency Review and Dependabot support this process but do not replace human judgment.

## Generated AI changes

AI-generated code is normal code: it must be understandable, testable, maintainable, and owned by the team after merge.

Do not merge code the team cannot explain or safely operate.

## Production

Deployment, rollback, environments, operations, and incident responsibilities are defined in:

- `docs/ENVIRONMENTS.md`
- `docs/RELEASES.md`
- `docs/OPERATIONS.md`
- `docs/SECURITY_MODEL.md`
- `docs/ENTERPRISE_READINESS.md`

Repository/agent access is not production authorization.
