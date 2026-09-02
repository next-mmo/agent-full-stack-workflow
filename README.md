# full-stack-ai

Enterprise-oriented Todo starter for human-reviewed AI-assisted development.

## Stack

- NestJS + Prisma + PostgreSQL
- Vite + React + TypeScript
- Tailwind + shadcn/ui-compatible primitives
- TanStack Query
- pnpm monorepo
- Claude Code
- EveryInc Compound Engineering
- Official Atlassian (Jira/Confluence) Claude plugin
- Official Figma Claude plugin + Figma Agent Skills
- Claude + Codex automated PR review layers

## Agent system

```text
AGENTS.md                         portable company/repo rules
CLAUDE.md                         Claude Code project memory
apps/api/AGENTS.md                backend rules
apps/web/AGENTS.md                frontend rules

.claude/settings.json             permissions + approved plugin onboarding
.claude/skills/                   project-specific reusable skills
.claude/agents/                   read-only reviewer subagents

.compound-engineering/            Compound Engineering config
.github/CODEOWNERS                human ownership
.github/workflows/ci.yml          deterministic quality gate
.github/workflows/pr-policy.yml   PR evidence gate
.github/workflows/claude-auto-review.yml
.github/workflows/codex-managed-review.yml
```

See:

- `docs/AGENT_SYSTEM.md`
- `docs/INTEGRATIONS.md`
- `docs/AI_REVIEW_POLICY.md`

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Frontend: http://localhost:5173  
API: http://localhost:3000/api  
Swagger: http://localhost:3000/docs

## Claude Code onboarding

Start from the repository root:

```bash
claude
```

After trusting the checkout, project settings can prompt for the approved plugins:

```text
compound-engineering@compound-engineering-plugin
figma@claude-plugins-official
atlassian@claude-plugins-official
```

Then run:

```text
/ce-setup
/company-integrations
```

`/company-integrations` asks the developer to select:

```text
1. Jira + Confluence
2. Figma
3. Both
4. None / skip
```

It also asks whether the developer needs read/context access only or expects writes. Read/context only is the company default.

Authentication is done interactively through `/mcp`; credentials are never committed to the repository.

Useful Claude commands:

```text
/memory
/skills
/agents
/permissions
/plugin
/mcp
```

## Project Skills

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

When a full-stack task explicitly references Jira/Confluence or Figma, the project workflow uses that context before planning/implementation. It does not browse unrelated company data merely because an integration is connected.

## Enterprise feature workflow

```text
Jira / requirement / Figma
      ↓
External context when explicitly referenced
      ↓
/ce-brainstorm
      ↓
/ce-plan
      ↓
Human plan review when risk is high
      ↓
/ce-work
      ↓
Project Skills
      ↓
/ce-simplify-code
      ↓
Lint + tests + build + e2e
      ↓
/ce-code-review
      ↓
Reviewer subagents
      ↓
/ce-test-browser
      ↓
/ce-compound
      ↓
/company-human-handoff
      ↓
Pull Request
      ├─ CI
      ├─ PR policy
      ├─ Claude advisory review
      ├─ Codex managed review
      └─ CODEOWNERS
      ↓
HUMAN APPROVAL
      ↓
Merge
```

## Automated AI reviews

### Claude

The Anthropic GitHub Action supports either:

```text
CLAUDE_CODE_OAUTH_TOKEN
```

or:

```text
ANTHROPIC_API_KEY
```

So an Anthropic API key is **not required specifically**. If neither credential is configured, the Claude review workflow safely no-ops.

For enterprise deployment, prefer organization-managed authentication or Anthropic Workload Identity Federation.

### Codex

The Codex managed-review path intentionally does **not** use `openai/codex-action`.

The GitHub workflow requests:

```text
@codex review
```

once per PR head. The installed `chatgpt-codex-connector[bot]` performs the managed review through the connected Codex/ChatGPT account, so the repository does not need an `OPENAI_API_KEY` for this path.

Human approval remains mandatory regardless of Claude/Codex output.

## Reviewer subagents

```text
architecture-reviewer
security-reviewer
verification-reviewer
```

They are advisory and do not replace an authorized human reviewer.

## Company controls

AI may propose, implement, test, review, document, gather approved external context, and prepare pull requests.

AI must **not**:

- merge its own PR
- self-approve
- bypass CI/CODEOWNERS/branch protection
- push directly to protected branches
- expose company credentials
- perform destructive production operations
- perform high-impact Jira/Confluence bulk mutations without confirmation
- write to Figma unless the user explicitly requests a design mutation
- weaken security-sensitive controls without explicit human direction

## Before production company use

1. Replace placeholder owners in `.github/CODEOWNERS` with real GitHub teams/users.
2. Configure the `main` branch/ruleset using `docs/GITHUB_PROTECTION.md`.
3. Run `/ce-setup` on the first trusted checkout.
4. Run `/company-integrations` and authenticate only approved external systems.
5. Put secrets in the organization's approved secret manager, never in the repository.
6. Configure Atlassian/Figma organization-level access and audit policy.
7. Configure Claude review authentication if the company wants Claude GitHub review.
8. Install/enable the Codex GitHub connector if the company wants managed Codex review.
9. Require human approval for every PR; require domain/security owners for high-risk changes.
