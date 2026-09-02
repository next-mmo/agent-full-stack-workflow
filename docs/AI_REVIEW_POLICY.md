# AI Review Policy

## Purpose

AI is a contributor and reviewer aid, not the final authority.

This repository supports two automated review layers:

1. **Claude Auto Review** through Anthropic's official `anthropics/claude-code-action`.
2. **Codex Managed Review** through the installed `chatgpt-codex-connector` GitHub App.

Human review remains mandatory regardless of automated reviewer output.

## Automatic Claude review

Implemented by `.github/workflows/claude-auto-review.yml`.

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

### Claude authentication

Claude review needs Anthropic authentication, but it does **not** require an API key specifically.

Supported starter options:

```text
CLAUDE_CODE_OAUTH_TOKEN
```

or

```text
ANTHROPIC_API_KEY
```

The OAuth token is the preferred no-API-key option for supported Claude Code subscription accounts. For larger enterprise deployments, prefer Anthropic Workload Identity Federation so GitHub OIDC is exchanged for short-lived credentials instead of storing a long-lived secret.

If neither credential is configured, Claude Auto Review intentionally becomes a successful no-op instead of breaking pull requests.

Never place credentials directly in workflow YAML.

## Automatic Codex managed review

Implemented by `.github/workflows/codex-managed-review.yml` plus the OpenAI Codex GitHub App.

This path intentionally does **not** use `openai/codex-action`.

`openai/codex-action` is a separate CI product that runs Codex CLI on the Actions runner and requires an API/provider key. The managed Codex GitHub reviewer instead uses the repository's connected Codex/ChatGPT account and does not require an `OPENAI_API_KEY` repository secret.

The trigger workflow runs for a non-draft PR when it is:

- opened
- updated with new commits
- reopened
- marked ready for review

For each new PR head SHA it posts one:

```text
@codex review
```

request with an invisible head-SHA marker so duplicate requests are not posted for the same commit.

The review itself is produced by:

```text
chatgpt-codex-connector[bot]
```

The Codex GitHub App must be installed for the repository and Codex code review must be enabled for the repository/workspace. The repository already verified that the connector receives manual `@codex review` requests.

### Security of the Codex trigger workflow

The trigger uses `pull_request_target` only because it needs permission to post a PR comment.

It must remain metadata-only. It must **never**:

- checkout the PR head
- execute PR scripts
- install dependencies from the PR
- build or test untrusted PR code
- expose repository secrets to PR code

Its only job is to inspect PR metadata/comments and post the Codex review request.

## Separation of duties

The same AI session may implement and run an AI review, but that review does not count as independent human approval.

Human review is mandatory.

Claude and Codex reviews are quality signals, not GitHub approvals and not substitutes for CODEOWNERS.

For important changes, two different model families reviewing the same PR can improve defect discovery, but humans remain accountable for deciding which findings are valid and whether the change may merge.

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

Automated review findings should use:

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

Automated reviewers should additionally report or surface:

- actionable correctness/security findings
- whether database/security/API-contract surfaces changed
- visible CI/test evidence when available
- remaining areas for human review

## Prohibited AI claims

AI must not say:

- "approved"
- "safe for production"
- "ready to merge"

unless clearly qualified as an AI assessment and still pending human approval.

Preferred wording:

> Automated implementation and checks are complete. Human review is required before merge.
