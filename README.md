# full-stack-ai

Enterprise-oriented full-stack starter for **human-reviewed AI-assisted engineering**.

It is intentionally more than a Todo demo: the sample application exists to exercise architecture, testing, migrations, AI workflows, external context, CI, review, release, and operational governance.

## Stack

### Application

- NestJS + Prisma + PostgreSQL
- Vite + React + TypeScript
- Tailwind + shadcn/ui-compatible primitives
- TanStack Query
- pnpm monorepo with committed lockfile

### AI engineering

- portable `AGENTS.md`
- Claude Code + scoped `CLAUDE.md`
- EveryInc Compound Engineering
- repository-specific Agent Skills
- read-only architecture/security/verification subagents
- official Atlassian Jira/Confluence plugin
- official Figma plugin + Figma Agent Skills
- Claude + managed Codex PR review layers
- CI + dependency review + PR evidence policy + CODEOWNERS

---

# Architecture

Read **`docs/ARCHITECTURE.md` first** for the full runtime and AI-engineering diagrams.

Application flow:

```text
React UI
  ↓
TanStack Query
  ↓
Typed API client
  ↓ HTTP /api
Nest Controller
  ↓
DTO validation
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

AI engineering model:

```text
                  LLM
                   │
                Harness
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    AGENTS.md    Skills      MCP / Plugins
      Rules      Playbooks    Tools / Data
        │          │          │
        └──────────┴──────────┘
                   │
             Repo / CI / PR
                   │
          Human review + approval
```

**LLM = brain, Harness = worker loop, AGENTS = rules, Skills = playbooks, MCP = external tools/data, Human = accountable approver.**

---

# Repository structure

```text
AGENTS.md                         portable company/repo rules
CLAUDE.md                         Claude Code project memory/router
CONTRIBUTING.md                   contributor workflow
SECURITY.md                       vulnerability-reporting entry point
pnpm-lock.yaml                    reviewed reproducible dependency resolution

apps/api/                         NestJS + Prisma backend
apps/web/                         Vite + React frontend

.claude/settings.json             permissions + approved plugin onboarding
.claude/skills/                   company/project reusable procedures
.claude/agents/                   read-only specialist reviewers
.compound-engineering/            Compound Engineering configuration

.github/CODEOWNERS                human ownership boundaries
.github/workflows/ci.yml          deterministic app quality gate
.github/workflows/pr-policy.yml   PR evidence gate
.github/workflows/dependency-review.yml
.github/workflows/claude-auto-review.yml
.github/workflows/codex-managed-review.yml

docs/ARCHITECTURE.md              runtime + AI system architecture/diagrams
docs/AGENT_SYSTEM.md              detailed agent-system design
docs/TESTING.md                   testing/evidence strategy
docs/SECURITY_MODEL.md            trust/security model
docs/INTEGRATIONS.md              Jira/Figma/MCP policy
docs/ENVIRONMENTS.md              environment/configuration policy
docs/RELEASES.md                  release/migration/rollback policy
docs/OPERATIONS.md                observability/incident/runbook baseline
docs/ENTERPRISE_READINESS.md      production-readiness checklist
docs/adr/                         durable architecture decisions
docs/plans/                       implementation plans
docs/solutions/                   compounded project learning
```

See `docs/README.md` for the documentation map and reading paths.

---

# Quick start

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:3000/api`  
Swagger: `http://localhost:3000/docs`

Dependency resolution is committed in `pnpm-lock.yaml`; CI also uses frozen installs and pnpm caching.

---

# Claude Code onboarding

Start from repository root:

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

`/company-integrations` asks the developer to select Jira/Confluence, Figma, both, or neither, and whether the intended mode is read/context only or includes writes. Read/context is the company default.

Authenticate integrations interactively through `/mcp`. Never commit credentials.

Useful Claude commands:

```text
/memory
/skills
/agents
/permissions
/plugin
/mcp
```

---

# Project Skills

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

Project Skills complement Compound Engineering; they do not replace planning/review.

---

# Enterprise feature workflow

```text
Jira / requirement / Figma
      ↓
Explicit external context when relevant
      ↓
/ce-brainstorm
      ↓
/ce-plan
      ↓
Human plan / architecture review when high risk
      ↓
/ce-work + project Skills
      ↓
/ce-simplify-code
      ↓
Lint + unit + build + API e2e
      ↓
/ce-code-review
      ↓
Architecture / Security / Verification reviewers
      ↓
/ce-test-browser for user-facing behavior
      ↓
/ce-compound
      ↓
/company-human-handoff
      ↓
Pull Request
      ├─ CI
      ├─ PR evidence policy
      ├─ Dependency Review
      ├─ Claude advisory review
      ├─ Codex managed review
      └─ CODEOWNERS / domain reviewers
      ↓
HUMAN APPROVAL
      ↓
Merge
      ↓
Human-owned release process
```

AI implementation, AI review, and green CI are evidence—not accountable approval.

---

# Automated AI reviews

## Claude

The Anthropic GitHub Action supports either:

```text
CLAUDE_CODE_OAUTH_TOKEN
```

or:

```text
ANTHROPIC_API_KEY
```

If neither is configured, Claude review intentionally becomes a successful no-op rather than blocking PRs. Enterprise deployments may use centrally managed authentication/WIF according to platform/security policy.

## Codex

The primary Codex reviewer is the managed `chatgpt-codex-connector` GitHub App, not `openai/codex-action`.

The managed reviewer uses the connected Codex/ChatGPT account, so this repository does not need an `OPENAI_API_KEY` for that review path.

Managed Codex handles normal review entry points. The metadata-only companion workflow requests a fresh `@codex review` after new PR commits/reopen; it must never checkout or execute untrusted PR-head code.

Human approval remains mandatory regardless of AI output.

---

# Company controls

AI may propose, implement, test, review, document, gather explicitly relevant approved external context, prepare release evidence, assist incident investigation, and prepare pull requests.

AI must **not**:

- merge/self-approve around required humans
- bypass CI/CODEOWNERS/branch protection
- push directly to protected branches
- expose credentials or sensitive company/customer data
- perform destructive production operations
- treat repository access as production authorization
- transition/bulk-update Jira or write Figma without explicit intent
- weaken security controls without explicit human direction
- declare a release/incident successful without human-owned verification

---

# Before real company production

Use `docs/ENTERPRISE_READINESS.md` as the authoritative checklist.

Repository-level reproducibility, architecture documentation, agent governance, testing policy, dependency review, release/operations templates, and security/trust rules are now present.

The important remaining blockers/admin/product decisions are intentionally **not fabricated by this starter**:

1. replace placeholder CODEOWNERS with real organization teams
2. verify/enforce protected `main` rules and required human approval
3. enable the company's approved CodeQL/code scanning and secret scanning/push protection
4. define actual dev/staging/prod accounts, secret manager, deployment system, and production access controls
5. define observability/SLOs/on-call ownership
6. define and test backup/restore and real rollback implementation
7. complete a product-specific threat model when auth, sensitive data, tenant boundaries, payments, or other high-risk features are introduced

The repository contains the policy, templates, Skills, and review rules for these controls, but repository files cannot pretend external company/platform configuration already exists.
