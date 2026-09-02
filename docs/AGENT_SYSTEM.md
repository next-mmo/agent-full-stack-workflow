# Enterprise Agent System

This repository separates permanent rules, reusable workflows, specialist reviewers, external integrations, automatic PR review, and human governance.

## Structure

```text
AGENTS.md                         cross-agent company/repository rules
CLAUDE.md                         Claude Code entry point; imports company rules

apps/api/AGENTS.md                backend-specific rules
apps/api/CLAUDE.md                loads backend scoped rules in Claude
apps/web/AGENTS.md                frontend-specific rules
apps/web/CLAUDE.md                loads frontend scoped rules in Claude

.claude/settings.json             permissions + approved team plugin onboarding
.claude/skills/                   repository-specific reusable procedures
.claude/agents/                   read-only specialist reviewers

.compound-engineering/            Compound Engineering repo configuration
docs/plans/                       CE plans
docs/solutions/                   compounded project learnings
docs/INTEGRATIONS.md              Jira/Figma onboarding and security rules

.github/CODEOWNERS                human ownership boundaries
.github/workflows/ci.yml          build/test quality gate
.github/workflows/pr-policy.yml   PR evidence/policy gate
.github/workflows/claude-auto-review.yml
                                  automatic advisory Claude PR reviewer
.github/workflows/codex-managed-review.yml
                                  no-OPENAI_API_KEY Codex managed-review trigger
.github/pull_request_template.md  human-review evidence template
```

## Responsibility layers

### `AGENTS.md`

Stable engineering and governance rules. Keep these portable across agent harnesses.

### `CLAUDE.md`

Claude Code memory and routing. It imports generic rules and explains how Claude-specific capabilities should be used.

### Project Skills

Located under `.claude/skills/`.

Current company Skills include:

```text
/company-fullstack-feature
/company-backend-api
/company-frontend-feature
/company-db-migration
/company-security-check
/company-human-handoff
/company-integrations
/company-jira-context
/company-figma-design
```

`company-integrations` is intentionally manual so the developer explicitly selects Jira/Confluence, Figma, both, or neither.

The Jira/Figma workflow Skills may be discovered when the task explicitly references their corresponding systems.

### Approved external integrations

The project pre-bundles approved plugins in `.claude/settings.json`:

```text
compound-engineering@compound-engineering-plugin
figma@claude-plugins-official
atlassian@claude-plugins-official
```

Figma's official plugin includes Figma MCP configuration plus Figma Agent Skills.

Atlassian's official plugin provides Jira/Confluence context through Atlassian Rovo MCP.

External integration policy is **read/context first**. Writes require explicit user intent, with additional confirmation for high-impact bulk mutations.

See `docs/INTEGRATIONS.md`.

### Reviewer subagents

Located under `.claude/agents/`:

```text
architecture-reviewer
security-reviewer
verification-reviewer
```

They are advisory and do not count as human approval.

### Compound Engineering

EveryInc Compound Engineering supplies the higher-level loop:

```text
brainstorm -> plan -> work -> simplify -> review -> test -> compound
```

Project Skills add repository-specific NestJS/Vite/PostgreSQL/security/integration conventions inside that loop.

## First checkout

```bash
git clone <repository-url>
cd agent-full-stack-workflow
pnpm install
claude
```

After trusting the workspace, Claude Code can prompt for the approved marketplaces/plugins declared in `.claude/settings.json`.

Then run:

```text
/ce-setup
/company-integrations
```

Useful discovery/status commands:

```text
/skills
/agents
/memory
/permissions
/plugin
/mcp
```

## Integration onboarding

`/company-integrations` asks:

```text
1. Jira + Confluence
2. Figma
3. Both
4. None / skip
```

It also asks whether access should be read/context only or include writes.

Default: read/context only.

OAuth/provider credentials are never committed to this repository.

## Automatic PR review

### Claude Auto Review

`.github/workflows/claude-auto-review.yml` runs Anthropic's official `anthropics/claude-code-action` on non-draft PRs when Claude authentication is configured.

Supported starter authentication:

```text
CLAUDE_CODE_OAUTH_TOKEN   # no Anthropic API key required
ANTHROPIC_API_KEY         # API-key fallback
```

If neither exists, the workflow intentionally no-ops successfully.

Enterprise teams should consider Anthropic Workload Identity Federation instead of long-lived secrets.

Claude has repository read access plus PR-comment capability; it cannot merge or push source through the review workflow.

### Codex Managed Review

`.github/workflows/codex-managed-review.yml` does not run `openai/codex-action` and does not require an `OPENAI_API_KEY` repository secret.

It posts one managed:

```text
@codex review
```

request per PR head SHA. The installed `chatgpt-codex-connector[bot]` performs the actual managed review through the connected Codex/ChatGPT account.

The trigger uses `pull_request_target` only to post metadata/comments. It must never checkout or execute PR-head code.

### Human authority

Claude and Codex reviews are supplemental evidence only.

Neither automated review replaces CODEOWNERS or human approval.

See `docs/AI_REVIEW_POLICY.md`.

## Standard feature workflow

```text
Ticket / requirement
       |
       +--> Jira/Confluence context when explicitly referenced
       |
       +--> Figma design context when explicitly referenced
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
       +--> company Skills apply as relevant
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
       +--> architecture/security/verification reviewers
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
       +--> CI
       +--> PR policy
       +--> Claude advisory review
       +--> Codex managed review
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
- high-impact external-system bulk mutations

High-risk work should receive human plan review before implementation and explicit domain/security review before merge.

## What is intentionally not automated

Repository configuration does not automatically:

- merge or approve pull requests
- bypass CI/CODEOWNERS/branch protection
- execute destructive production operations
- store company Jira/Figma credentials
- transition Jira work to Done/Released merely because AI finished coding
- write to Figma as an automatic side effect of implementation

## Human accountability

AI can gather context, implement, test, review, and produce evidence.

The final gate remains an authorized human reviewer under repository and organization policy.
