# CLAUDE.md

@AGENTS.md
@docs/WORKFLOW.md
@docs/AI_REVIEW_POLICY.md

## Claude Code-specific guidance

The imported documents are authoritative project instructions. Do not duplicate or weaken them.

For substantial work, also read the relevant non-imported source-of-truth docs named by `AGENTS.md`, especially `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/SECURITY_MODEL.md`, `docs/RELEASES.md`, and `docs/OPERATIONS.md` when their scope applies. They are intentionally not all imported into every Claude session to avoid unnecessary context load.

This repository uses the EveryInc Compound Engineering plugin as the primary engineering workflow layer. For substantial feature work, prefer:

```text
/ce-brainstorm
/ce-plan
/ce-work
/ce-simplify-code
/ce-code-review
/ce-test-browser
/ce-compound
```

Use `/ce-debug` for bug investigation.

If the Compound Engineering plugin is unavailable, say so and follow the same phases manually rather than skipping planning/review.

## Project skills

Project-specific reusable procedures live under `.claude/skills/`.

Use them when relevant, especially for:

- full-stack feature delivery
- backend API changes
- frontend feature work
- database migrations
- architecture decisions/diagram changes
- security-sensitive review
- Jira/Figma context
- release readiness
- incident assistance
- PR handoff to humans

Useful project Skills include:

```text
/company-fullstack-feature
/company-backend-api
/company-frontend-feature
/company-db-migration
/company-architecture-change
/company-security-check
/company-integrations
/company-jira-context
/company-figma-design
/company-release-readiness
/company-incident-assist
/company-human-handoff
```

These skills complement Compound Engineering. They define this repository's implementation, operational, and handoff expectations; they do not replace the CE planning/review loop.

## Reviewer subagents

Read-only project reviewers live under `.claude/agents/`.

Use them when independent context helps evaluate architecture, security, or verification. They review against the repository's documented architecture/security/testing standards. Their output is advisory and never counts as human approval.

## Scoped instructions

When working under `apps/api` or `apps/web`, read and follow the nearest `AGENTS.md` in addition to the root rules.

## Production boundary

Repository/terminal access is not production authorization.

Do not deploy, rollback, run destructive production database operations, rotate/reveal secrets, or declare an incident resolved unless an authorized human explicitly owns the action and the company's approved production tool/access path permits it.

## Final handoff

Do not merge, self-approve, or push directly to protected branches.

End substantial work with a review-ready summary that clearly states:

- implementation status
- architecture/documentation impact
- validation performed
- risk and security impact
- database/migration impact
- release/operations impact when applicable
- rollback notes
- unresolved items
- that human approval is still required
