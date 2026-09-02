# Enterprise Readiness

This file is the company-readiness checklist for the starter.

It separates what is **implemented in the repository**, what is **configured outside the repository**, and what remains a **production-specific/company decision**.

A green CI build alone does not mean the system is production-ready.

## Status legend

| Status | Meaning |
|---|---|
| ✅ Repository | Implemented and version-controlled here |
| ⚙️ Admin/company | Must be configured/decided outside normal code changes |
| 🏗️ Product/infra | Must be decided for the real deployed product |
| 🚫 Blocker | Do not call the project company-production-ready until resolved |

## Readiness matrix

| Area | Status | Required action / evidence |
|---|---|---|
| Application architecture | ✅ Repository | `docs/ARCHITECTURE.md` + ADRs |
| Portable agent rules | ✅ Repository | root/scoped `AGENTS.md` |
| Claude routing/permissions | ✅ Repository | `CLAUDE.md`, `.claude/settings.json` |
| Reusable Skills | ✅ Repository | `.claude/skills/` |
| Specialist AI reviewers | ✅ Repository | `.claude/agents/` |
| Compound Engineering | ✅ Repository | plugin config + CE workflow docs |
| Jira/Figma context policy | ✅ Repository | approved plugins + read-first Skills |
| AI data-handling baseline | ✅ Repository + ⚙️ Company | `docs/AI_DATA_POLICY.md`; company must define approved providers/data classes/contract terms |
| Developer onboarding/offboarding | ✅ Repository + ⚙️ Company | `docs/ONBOARDING.md`; company identity/access systems remain authoritative |
| Runtime/toolchain reproducibility | ✅ Repository | Node 22 + pnpm 10 declared; `.node-version` + `packageManager`/engines |
| Deterministic CI | ✅ Repository | committed `pnpm-lock.yaml`, frozen install, pnpm cache, lint/test/build/e2e |
| Dependency update automation | ✅ Repository | Dependabot config |
| Dependency vulnerability gate | ✅ Repository | Dependency Review workflow |
| Static code analysis | ✅ Repository / pending run evidence | CodeQL workflow for JavaScript/TypeScript; verify final workflow result/security-tab availability |
| Architecture documentation | ✅ Repository | diagrams + ADR policy + architecture reviewer |
| Testing strategy | ✅ Repository | `docs/TESTING.md` + CI evidence |
| Security/trust model | ✅ Repository | `docs/SECURITY_MODEL.md` + security reviewer |
| Environment policy | ✅ Repository | `docs/ENVIRONMENTS.md` template/policy |
| Release/rollback policy | ✅ Repository | `docs/RELEASES.md` + release-readiness Skill |
| Operations/incident policy | ✅ Repository | `docs/OPERATIONS.md` + incident-assist Skill |
| Secret scanning | ⚙️ Admin/company | enable GitHub secret scanning/push protection or approved equivalent where available |
| Branch/ruleset enforcement | ⚙️ Admin/company | protect `main`; effective protection is not verified by repository files |
| Required human approval | ⚙️ Admin/company | require PR review/CODEOWNERS in GitHub |
| CODEOWNERS identities | 🚫 Blocker | replace `@your-org/...` placeholders with real teams |
| Claude GitHub review | ⚙️ Admin/company | configure approved OAuth/API/WIF authentication if desired |
| Codex managed review | ✅/⚙️ | connector verified; organization controls/data policy still apply |
| Repository visibility/license intent | ⚙️ Company | repo is public; confirm public visibility and choose legal license if external reuse is intended |
| AI provider approval | ⚙️ Company | approve providers/accounts, data classes, retention/training/residency/audit terms |
| Real environment separation | 🏗️ Product/infra | fill actual dev/staging/prod accounts, URLs, secrets, data policy |
| Production deployment | 🏗️ Product/infra | choose platform and deployment topology |
| Observability | 🏗️ Product/infra | logs, metrics, traces, dashboards, alerts, ownership |
| SLOs | 🏗️ Product/infra | define service objectives and alert thresholds |
| Backup/restore | 🏗️ Product/infra | define RPO/RTO and test restore procedure |
| Data classification/privacy | ✅ policy + 🏗️ | classify real product data before production |
| Authentication/authorization | 🏗️ Product | starter intentionally does not invent auth requirements |
| Artifact provenance | 🏗️ Release | add/verify attestations when shipping binaries/images/packages |
| Dependency license policy | ⚙️ Company | define accepted/restricted licenses before enforcing license gates |

## Hard blockers before real company production

1. Replace placeholder CODEOWNERS with real people/teams.
2. Verify/enforce protected `main` rules: PR-only, required checks, required human approval, CODEOWNERS, no force push/bypass except audited break-glass policy.
3. Enable/verify company-approved secret scanning/push protection and confirm CodeQL/security scanning is operational.
4. Approve AI providers/accounts/plugins and define which company data classifications may be sent to each provider.
5. Confirm repository visibility and legal/license intent; do not leave a public company starter accidentally public or ambiguously licensed.
6. Define actual dev/staging/prod environment separation, secret ownership, and production access model.
7. Define production observability, alerting/SLOs, on-call ownership, backup/restore, and deployment/rollback implementation.
8. Complete a product-specific threat model for authentication, authorization, sensitive data, tenant boundaries, payments, or other high-risk features actually introduced.
9. Run a restore/rollback exercise before relying on the service operationally.
10. Replace all remaining operational placeholders (owners, URLs/accounts, systems) with real company configuration before production.

## Repository controls vs external controls

```mermaid
flowchart LR
    Repo[Repository controls\nAGENTS · Skills · tests · CI · docs]
    Admin[Company/GitHub admin\nrulesets · identity · security · AI provider policy]
    Infra[Runtime controls\nenvironments · secrets · monitoring · backups]
    Human[Human accountability\nreview · approval · release · incident ownership]

    Repo --> Admin --> Infra --> Human
```

Repository files cannot prove that external administrative controls are enabled. The human/platform/security owner must verify them.

## Evidence rule

Mark an item complete only from concrete evidence, for example:

- repository file/CI result for repository controls
- GitHub/admin settings/API evidence for platform controls
- provider/legal/security approval for AI/data/license controls
- deployment/runbook/test evidence for production controls
- named human ownership for accountable decisions

Do not mark a row complete solely because an AI agent says it is complete.

## Review cadence

Review this checklist:

- before first production deployment
- when CI/repository security controls change
- when a new AI provider, model, MCP server, or plugin is approved
- when architecture or deployment topology changes
- after a meaningful incident that exposes a control gap
- during periodic access reviews
- at least once per major release cycle
