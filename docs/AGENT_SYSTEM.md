# Enterprise Agent System

This repository separates permanent rules, reusable workflows, specialist reviewers, plugin workflows, automatic PR review, and human governance.

## Structure

```text
AGENTS.md                         cross-agent company/repository rules
CLAUDE.md                         Claude Code entry point; imports company rules

apps/api/AGENTS.md                backend-specific rules
apps/api/CLAUDE.md                loads backend scoped rules in Claude
apps/web/AGENTS.md                frontend-specific rules
apps/web/CLAUDE.md                loads frontend scoped rules in Claude

.claude/settings.json             permissions + team plugin onboarding
.claude/skills/                   repository-specific reusable procedures
.claude/agents/                   read-only specialist reviewers

.compound-engineering/            Compound Engineering repo configuration
docs/plans/                       CE plans (default artifact area)
docs/solutions/                   compounded project learnings

.github/CODEOWNERS                human ownership boundaries
.github/workflows/ci.yml          build/test quality gate
.github/workflows/pr-policy.yml   PR evidence/policy gate
.github/workflows/claude-auto-review.yml
                                  automatic advisory Claude PR reviewer
.github/pull_request_template.md  human-review evidence template
```

## Responsibility layers

### `AGENTS.md`

Stable engineering and governance rules. Keep these portable across agent harnesses.

### `CLAUDE.md`

Claude Code memory and routing. It imports the generic rules and explains how Claude-specific capabilities should be used.

### Project Skills

Located under `.claude/skills/`. They contain reusable repository-specific procedures and load only when relevant.

Current skills:

```text
/company-fullstack-feature
/company-backend-api
/company-frontend-feature
/company-db-migration
/company-security-check
/company-human-handoff
```

The first five may be discovered automatically by Claude based on task context. `company-human-handoff` is intentionally manual so a developer explicitly requests the final review package.

### Reviewer subagents

Located under `.claude/agents/`.

```text
architecture-reviewer
security-reviewer
verification-reviewer
```

They are configured as read-only/plan reviewers. They provide independent context but do not count as human approval.

### Automatic GitHub Claude review

`.github/workflows/claude-auto-review.yml` runs Anthropic's official `anthropics/claude-code-action` for non-draft pull requests when `ANTHROPIC_API_KEY` is configured in GitHub Actions secrets.

It triggers on PR open, synchronize, reopen, and ready-for-review events. A new commit cancels an older in-progress review.

The workflow intentionally has no source-write or merge permission. Claude may:

```text
Read repository instructions and changed files
        ↓
gh pr view / diff / checks
        ↓
Inline review comments
        ↓
One top-level advisory summary
```

Claude may not approve or merge. The automatic review is supplemental evidence only.

See `docs/AI_REVIEW_POLICY.md` for reviewer severity and separation-of-duties rules.

### Compound Engineering

EveryInc Compound Engineering supplies the higher-level engineering loop:

```text
brainstorm -> plan -> work -> simplify -> review -> test -> compound
```

Project Skills add this repository's NestJS/Vite/database/security conventions inside that loop.

## First checkout

```bash
git clone <repository-url>
cd agent-full-stack-workflow
pnpm install
claude
```

When the repository is trusted, Claude Code can prompt for the Compound Engineering marketplace/plugin declared in `.claude/settings.json`.

If it is not installed, use:

```text
/plugin marketplace add EveryInc/compound-engineering-plugin
/plugin install compound-engineering@compound-engineering-plugin
```

Then run:

```text
/ce-setup
```

Useful discovery commands:

```text
/skills
/agents
/memory
/permissions
```

## GitHub auto-review setup

A repository or organization administrator must add the GitHub Actions secret:

```text
ANTHROPIC_API_KEY
```

Do not commit the key into YAML or repository files.

For a larger enterprise rollout, centralize authentication through your approved organization secret or Anthropic workload identity design after platform/security review.

## Standard feature workflow

```text
Ticket / requirement
       |
       v
/ce-brainstorm
       |
       v
Human product clarification when needed
       |
       v
/ce-plan
       |
       v
Human plan review for high-risk work
       |
       v
/ce-work
       |
       +--> repository project Skills apply as relevant
       |
       v
/ce-simplify-code
       |
       v
pnpm lint + test + build + test:e2e
       |
       v
/ce-code-review
       |
       +--> architecture/security/verification reviewers when useful
       |
       v
/ce-test-browser for user-facing behavior
       |
       v
/ce-compound
       |
       v
/company-human-handoff
       |
       v
Pull Request
       |
       +--> CI + PR policy
       |
       +--> automatic Claude advisory review
       |
       +--> CODEOWNERS / human reviewer
       |
       v
HUMAN APPROVAL
       |
       v
Merge / release
```

## High-risk work

Treat these as high risk by default:

- authentication or authorization
- payments
- secrets and credentials
- sensitive/personal data
- destructive/irreversible migrations
- CI/repository permissions
- infrastructure/security configuration

High-risk work should receive human plan review before implementation and explicit domain/security review before merge.

## What is intentionally not automated

Repository configuration does not automatically merge PRs, approve PRs, bypass permissions, execute destructive migrations, or store company credentials.

MCP integrations are not hardcoded because GitHub/Jira/Linear/cloud/database credentials and access policies are company-specific. Add approved MCP servers only through your organization's security process.

## Human accountability

AI can produce evidence and recommendations. It cannot be the accountable approver.

The final gate is always an authorized human reviewer under the repository's branch protection and CODEOWNERS policy.
