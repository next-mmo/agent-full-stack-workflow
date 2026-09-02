# full-stack-ai

Enterprise-oriented Todo starter for human-reviewed AI-assisted development.

## Stack

- NestJS + Prisma + PostgreSQL
- Vite + React + TypeScript
- Tailwind + shadcn-style UI primitives
- TanStack Query
- pnpm monorepo
- Claude Code + EveryInc Compound Engineering workflow

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

## Enterprise workflow

AI may propose, implement, test, and prepare pull requests.

AI must **not**:
- merge its own PR
- self-approve
- bypass CI
- bypass CODEOWNERS
- push directly to protected branches
- change security-sensitive controls without explicit human approval

Recommended feature loop:

```text
/ce-brainstorm
/ce-plan
/ce-work
/ce-simplify-code
/ce-code-review
/ce-test-browser
/ce-compound
```

Then open a PR for human review.


## Before using this in a company

1. Replace placeholder CODEOWNERS in `.github/CODEOWNERS`.
2. Configure the `main` branch/ruleset using `docs/GITHUB_PROTECTION.md`.
3. Install Compound Engineering in Claude Code.
4. Run `/ce-setup`.
5. Put secrets in your approved secret manager, never in the repository.
6. Require human approval for every PR.
