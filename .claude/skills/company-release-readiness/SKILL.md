---
name: company-release-readiness
description: Prepare a human-reviewable production release readiness package. Use when a release, deployment, hotfix, migration promotion, or rollback is being planned. This Skill never authorizes production release by itself.
user-invocable: true
---

# Release readiness

Read:

- `docs/RELEASES.md`
- `docs/OPERATIONS.md`
- `docs/ENTERPRISE_READINESS.md`
- relevant PRs/plans/ADRs

## Collect evidence

Report:

1. exact release commit/tag/version
2. included PRs/tickets
3. CI/security status actually observed
4. migrations and compatibility impact
5. configuration/secrets/environment dependencies
6. monitoring/alert coverage for changed critical paths
7. verification steps after deployment
8. rollback target/procedure
9. release owner and domain/security approvals still required
10. known risks/unresolved items

Do not infer a check passed if you did not observe evidence.

## High-risk release

Require explicit human/domain review when the release changes:

- auth/authz
- payments
- sensitive data
- destructive migrations
- secrets/security controls
- production infrastructure/network boundaries

## Production actions

Do not deploy to production, run destructive migrations, rotate secrets, or execute rollback operations unless an authorized human explicitly requests the specific action and the available tool permissions allow it under company policy.

End with:

> Release evidence is prepared. An authorized human release owner must make the production decision.
