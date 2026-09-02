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

## Agent system

This repository is fully initialized with separate layers for rules, skills, reviewers, workflow, and human governance:

```text
AGENTS.md                         portable company/repo rules
CLAUDE.md                         Claude Code project memory
apps/api/AGENTS.md                backend rules
apps/web/AGENTS.md                frontend rules

.claude/settings.json             permissions + plugin onboarding
.claude/skills/                   project-specific reusable skills
.claude/agents/                   read-only reviewer subagents

.compound-engineering/            Compound Engineering config
.github/CODEOWNERS                human ownership
.github/workflows/ci.yml          automated quality gate
```

See `docs/AGENT_SYSTEM.md` for the complete architecture and onboarding flow.

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

Start Claude Code from the repository root:

```bash
claude
```

The project settings advertise the approved EveryInc Compound Engineering marketplace/plugin. After trusting the repository, Claude Code can prompt the developer to install it.

Manual fallback:

```text
/plugin marketplace add EveryInc/compound-engineering-plugin
/plugin install compound-engineering@compound-engineering-plugin
/ce-setup
```

Inspect what Claude loaded with:

```text
/memory
/skills
/agents
/permissions
```

## Enterprise feature workflow

```text
Requirement / ticket
      ↓
/ce-brainstorm
      ↓
/ce-plan
      ↓
Human plan review when risk is high
      ↓
/ce-work
      ↓
Project Skills apply as relevant
      ↓
/ce-simplify-code
      ↓
Lint + tests + build + e2e
      ↓
/ce-code-review
      ↓
Reviewer subagents when useful
      ↓
/ce-test-browser
      ↓
/ce-compound
      ↓
/company-human-handoff
      ↓
Pull Request + CI + CODEOWNERS
      ↓
HUMAN APPROVAL
      ↓
Merge
```

AI may propose, implement, test, review, document, and prepare pull requests.

AI must **not** merge its own PR, self-approve, bypass CI/CODEOWNERS, push directly to protected branches, or weaken security-sensitive controls without explicit human direction.

## Project Skills

```text
/company-fullstack-feature
/company-backend-api
/company-frontend-feature
/company-db-migration
/company-security-check
/company-human-handoff
```

## Reviewer subagents

```text
architecture-reviewer
security-reviewer
verification-reviewer
```

These automated reviewers are advisory. They never replace an authorized human reviewer.

## Before production company use

1. Replace placeholder owners in `.github/CODEOWNERS` with real GitHub teams/users.
2. Configure the `main` branch/ruleset using `docs/GITHUB_PROTECTION.md`.
3. Run `/ce-setup` on the first trusted checkout.
4. Put secrets in the organization's approved secret manager, never in the repository.
5. Configure approved MCP integrations only through the company's access/security process.
6. Require human approval for every PR; require domain/security owners for high-risk changes.
