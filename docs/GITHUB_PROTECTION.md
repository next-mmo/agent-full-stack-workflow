# GitHub Repository Protection Checklist

Repository files cannot enforce all organization/repository settings. A platform administrator must configure and periodically verify these controls.

During the enterprise audit of this starter, the repository rulesets API returned no configured repository ruleset. Treat `main` protection as **not verified** until an administrator proves the effective branch/ruleset configuration.

## Protect `main`

Recommended ruleset / branch protection:

- require a pull request before merging
- require at least 1 authorized human approval
- consider 2 approvals for high-risk repositories/paths when team size allows
- dismiss stale approvals when new commits are pushed
- require review from Code Owners
- require conversation resolution before merging
- require status checks to pass
- require branch to be current with base when company policy needs it
- block force pushes
- block branch deletion
- restrict direct pushes to `main`
- do not allow AI/bot identities to bypass the ruleset
- restrict bypass capability to a small audited break-glass/admin group

## Required checks

After the relevant workflows are merged and stable, require:

```text
CI / validate
PR Policy / validate
Dependency Review / dependency-review
```

Do not make Claude/Codex review a substitute for deterministic CI or human review. AI-review jobs may be useful required signals only after the organization understands authentication, availability, cost, and failure behavior.

## Human approval

AI review is supplemental.

At least one authorized human reviewer must approve before merge.

For high-risk changes require the relevant CODEOWNER/domain/security/platform owner.

## CODEOWNERS

`.github/CODEOWNERS` intentionally contains `@your-org/...` placeholders in the starter.

Replacing them with real organization teams/users is a production-readiness blocker.

After replacement, enable **Require review from Code Owners**.

## Security features

Enable appropriate repository/organization security controls:

- dependency graph
- Dependabot alerts/security updates according to company policy
- dependency review
- CodeQL default code scanning or approved equivalent
- secret scanning and push protection where available

For private repositories, availability of some features depends on the organization's GitHub plan/security products.

## GitHub Actions security

- keep default workflow token permissions minimal/read-only where possible
- grant job-level write permissions only when a workflow actually needs them
- never execute untrusted PR-head code in privileged `pull_request_target` workflows
- review Actions as executable supply-chain dependencies
- keep GitHub Actions dependencies updated through Dependabot
- if organization policy requires immutable Actions references, pin actions to reviewed full commit SHAs and let the approved dependency-update process advance them
- restrict which Actions/reusable workflows may run at organization level when appropriate

The Codex `pull_request_target` companion must remain metadata/comment-only.

## Suggested high-risk paths

Require domain/platform/security ownership for paths such as:

```text
apps/api/src/**/auth*
apps/api/prisma/**
.github/**
.claude/**
AGENTS.md
CLAUDE.md
SECURITY.md
docs/SECURITY_MODEL.md
docs/ARCHITECTURE.md
deployment/**
infra/**
```

## Merge strategy

Prefer squash merge for normal feature branches unless the organization has another documented standard.

Do not auto-merge AI-authored changes around human approval requirements.

## PR evidence

The repository PR policy requires:

- source context
- architecture impact
- test evidence
- migration impact
- security/privacy impact
- dependency/supply-chain impact
- release/operations impact
- risk
- rollback
- human review

## Periodic audit

Platform owners should periodically verify the effective settings in GitHub, not only this documentation, especially after organization policy or GitHub product changes.
