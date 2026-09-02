# Documentation Map

Use this page to find the authoritative document instead of duplicating rules across files.

| Document | Purpose | Update when |
|---|---|---|
| `ARCHITECTURE.md` | Runtime + AI system diagrams/boundaries | architecture/flow/trust/deployment boundary changes |
| `AGENT_SYSTEM.md` | AGENTS/CLAUDE/Skills/agents/CE structure | agent framework or routing changes |
| `WORKFLOW.md` | Human-reviewed engineering lifecycle | delivery process/gates change |
| `TESTING.md` | Test levels and evidence strategy | testing approach changes |
| `SECURITY_MODEL.md` | Security/trust/prompt-injection/data model | security boundary/policy changes |
| `AI_REVIEW_POLICY.md` | Claude/Codex advisory review governance | AI reviewer/auth/permission changes |
| `INTEGRATIONS.md` | Jira/Figma/MCP integration policy | approved integration/access changes |
| `ENVIRONMENTS.md` | Environment/configuration/data/secret separation | environment/configuration policy changes |
| `RELEASES.md` | Release, migration promotion, rollback | release/deployment policy changes |
| `OPERATIONS.md` | Observability, incidents, backup/restore runbook | operational/on-call behavior changes |
| `ENTERPRISE_READINESS.md` | Production-readiness checklist | external/repo controls change |
| `GITHUB_PROTECTION.md` | Required GitHub admin controls | ruleset/branch policy changes |
| `adr/` | Durable architecture decisions | significant decision with trade-offs |
| `plans/` | Implementation-ready plans | substantial feature/project planning |
| `solutions/` | Reusable learned solutions | issue/incident/debug learning is worth preserving |

Root documents:

| Document | Purpose |
|---|---|
| `../README.md` | entry point / architecture summary / onboarding |
| `../AGENTS.md` | portable repository rules for coding agents |
| `../CLAUDE.md` | Claude Code routing/memory |
| `../CONTRIBUTING.md` | contributor workflow |
| `../SECURITY.md` | vulnerability-reporting policy |

## Reading paths

### New engineer

```text
README.md
  ↓
docs/ARCHITECTURE.md
  ↓
AGENTS.md
  ↓
CONTRIBUTING.md
  ↓
relevant scoped docs / source
```

### New Claude Code user

```text
README.md
  ↓
CLAUDE.md + AGENTS.md
  ↓
/ce-setup
  ↓
/company-integrations
  ↓
/skills / /agents / /mcp
```

### Architecture change

```text
ARCHITECTURE.md
  ↓
existing ADRs
  ↓
/company-architecture-change
  ↓
CE plan
  ↓
architecture reviewer + human owner
```

### Release / incident

```text
ENVIRONMENTS.md
RELEASES.md
OPERATIONS.md
SECURITY_MODEL.md
  ↓
/company-release-readiness or /company-incident-assist
  ↓
authorized human owner
```

## Source-of-truth rule

Link to an authoritative document rather than copying large policy sections into many files. If two documents conflict, stop and surface the conflict for a human/platform owner instead of silently choosing the easier rule.
