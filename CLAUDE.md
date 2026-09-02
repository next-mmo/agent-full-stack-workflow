# CLAUDE.md

@AGENTS.md
@docs/WORKFLOW.md
@docs/AI_REVIEW_POLICY.md

## Claude Code-specific guidance

The imported documents are authoritative project instructions. Do not duplicate or weaken them.

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
- security-sensitive review
- PR handoff to humans

These skills complement Compound Engineering. They define this repository's implementation and handoff expectations; they do not replace the CE planning/review loop.

## Reviewer subagents

Read-only project reviewers live under `.claude/agents/`.

Use them when independent context helps evaluate architecture, security, or test coverage. Their output is advisory and never counts as human approval.

## Scoped instructions

When working under `apps/api` or `apps/web`, read and follow the nearest `AGENTS.md` in addition to the root rules.

## Final handoff

Do not merge, self-approve, or push directly to protected branches.

End substantial work with a review-ready summary that clearly states:

- implementation status
- validation performed
- risk and security impact
- database/migration impact
- rollback notes
- unresolved items
- that human approval is still required
