# Developer and Agent Onboarding

This checklist covers human developer access and the local AI-agent setup. Company identity/access systems remain authoritative.

## Before access is granted

A manager/team owner should establish:

- employee/contractor identity and team
- repository role required
- Jira/Confluence groups required
- Figma project/team access required
- whether Claude/Codex/company AI tools are approved for that person
- environments the person may access
- whether production access is needed (default: no)

Use least privilege. Repository access does not imply production access.

## GitHub onboarding

1. Add the developer to the correct organization/team.
2. Grant repository access through teams rather than ad-hoc broad permissions when possible.
3. Require organization SSO/MFA/security controls according to company policy.
4. Do not give ruleset/branch-protection bypass solely because a developer uses an AI coding agent.
5. Production/release permissions should be separate from ordinary code contribution permissions.

## First checkout

```bash
git clone <repository-url>
cd agent-full-stack-workflow
```

Use the pinned runtime/toolchain:

```text
Node 22
pnpm 10.x
```

Install:

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Verify:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Required reading

New contributors should read:

1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `AGENTS.md`
4. `CONTRIBUTING.md`
5. `docs/SECURITY_MODEL.md`
6. `docs/AI_DATA_POLICY.md`
7. relevant scoped `apps/*/AGENTS.md`

Use `docs/README.md` as the documentation map.

## Claude Code setup

From the repository root:

```bash
claude
```

Inspect loaded controls:

```text
/memory
/permissions
/skills
/agents
/plugin
/mcp
```

Initialize the approved engineering workflow:

```text
/ce-setup
/company-integrations
```

The developer explicitly chooses Jira/Confluence, Figma, both, or neither. Read/context access is the default.

Authenticate through provider OAuth/MCP flows. Never place OAuth/API tokens in repository files or chat.

## Codex / other harnesses

Portable `AGENTS.md` rules apply even when the developer uses a different compatible harness.

Do not assume Claude-specific Skills/plugins are available in another harness. Follow the same architecture, security, testing, and human-review policies manually or through equivalent approved tooling.

## Production access

Production access is not part of normal onboarding by default.

When required, it should have:

- a business/operational reason
- named approving owner
- least-privilege role
- auditable identity
- separate secret/access path
- removal/expiry process

Never put reusable production credentials into an AI agent configuration.

## First PR

A first PR should demonstrate that the developer understands:

- branch/PR-only workflow
- CI evidence
- AI-assistance disclosure
- architecture/security/rollback sections
- human review requirement

Do not bypass controls to make onboarding easier.

---

# Offboarding / access change

When a person leaves the team/company or no longer needs access:

1. remove/adjust GitHub organization/team access
2. remove Jira/Confluence groups
3. remove Figma team/project access
4. revoke personal OAuth grants/tokens for approved AI/MCP integrations as company policy requires
5. remove production/cloud/database access separately
6. rotate shared credentials if the person ever had access to a shared secret (prefer not to use shared secrets)
7. remove on-call/release/admin roles
8. transfer ownership of open PRs, incidents, runbooks, and operational responsibilities
9. verify there are no personal credentials embedded in automation/configuration

Do not delete audit history merely because the person was offboarded.

## Periodic access review

Company/platform owners should periodically review:

- repository admin/bypass roles
- CODEOWNER teams
- production access
- external MCP/application OAuth grants
- CI/release identities
- stale service accounts/tokens

The cadence is company-specific; higher-risk access deserves more frequent review.
