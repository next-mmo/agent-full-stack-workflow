# AI Review Policy

## Purpose

AI is a contributor and reviewer aid, not the final authority.

This repository runs an automatic Claude review on ready pull requests when company Claude authentication is configured.

The automated review is implemented by `.github/workflows/claude-auto-review.yml` using Anthropic's official `anthropics/claude-code-action`.

## Automatic Claude review

The review runs when a non-draft pull request is:

- opened
- updated with new commits
- reopened
- marked ready for review

A newer commit cancels an older in-progress Claude review so feedback is tied to the current PR head.

The reviewer has read-only repository access plus permission to write PR feedback. It may:

- read repository instructions and changed code
- inspect the PR with GitHub CLI (`gh pr view`, `gh pr diff`, `gh pr checks`)
- post inline findings
- post a top-level review summary

It may not:

- modify source code
- push commits
- approve the pull request
- merge the pull request
- bypass CI or branch protection

Claude-authored bot PRs are skipped by this workflow to reduce direct self-review. AI-created changes committed under a human identity may still receive the automated review; this remains advisory and is not independent approval.

## Authentication

The starter expects the GitHub Actions secret:

```text
ANTHROPIC_API_KEY
```

Prefer an organization-level Actions secret when many company repositories use the same controlled Anthropic account/workspace.

For a larger enterprise deployment, workload identity federation or another centrally managed Anthropic authentication method can replace a static repository secret after security/platform review.

Do not place credentials directly in workflow YAML.

## Separation of duties

The same AI session may implement and run an AI review, but that review does not count as independent approval.

Human review is mandatory.

The automatic Claude review is a quality signal, not a GitHub approval and not a required substitute for CODEOWNERS.

## Required human review

All pull requests require a human.

Additional domain review is required for:

| Change | Required human |
|---|---|
| Normal frontend | Frontend reviewer |
| Normal backend | Backend reviewer |
| Database migration | Backend/data owner |
| Auth/authz | Backend + security owner |
| CI/repository rules | Platform owner |
| Sensitive data | Security/privacy owner |

## Automated finding severity

Claude review findings use:

- `P0` — critical security, data-loss, or production blocker
- `P1` — correctness/security issue that should block merge
- `P2` — meaningful improvement or missing verification that should be addressed or consciously accepted

Humans decide whether a finding is valid and how it is resolved.

## Evidence expected from AI

Before handoff, AI should provide:

1. plan followed
2. files changed
3. tests run
4. test results
5. known risks
6. migration impact
7. security impact
8. rollback notes
9. unresolved questions

The automatic reviewer should additionally report:

- finding counts by severity
- whether database/security/API-contract surfaces changed
- visible CI/test evidence
- remaining areas for human review

## Prohibited AI claims

AI must not say:

- "approved"
- "safe for production"
- "ready to merge"

unless clearly qualified as an AI assessment and still pending human approval.

Preferred wording:

> Automated implementation and checks are complete. Human review is required before merge.
