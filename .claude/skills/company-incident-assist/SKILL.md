---
name: company-incident-assist
description: Safe company procedure for assisting a human incident owner with production investigation, mitigation planning, and post-incident follow-up. Use for outages, degraded production behavior, security incidents, or urgent operational failures.
---

# Incident assistance

Read `docs/OPERATIONS.md`, `docs/RELEASES.md`, and `docs/SECURITY_MODEL.md`.

## First establish

- observed impact and affected service/environment
- when it started
- recent deployments/migrations/config changes
- available telemetry/evidence
- named human incident owner

If severity/security impact is uncertain, surface the uncertainty instead of minimizing it.

## Agent role

You may:

- organize logs and symptoms
- identify hypotheses
- compare against recent changes
- suggest safe diagnostic commands
- draft rollback/forward-fix options
- prepare a reviewed code patch
- draft status/post-incident notes

You must not autonomously:

- delete/modify production data
- run destructive SQL
- expose/rotate secrets
- weaken auth/security controls
- disable auditing/monitoring
- declare the incident resolved

## Evidence discipline

Separate:

```text
Observed fact
Hypothesis
Proposed diagnostic
Proposed mitigation
Human decision required
```

Never present a hypothesis as an observed fact.

## Recovery

After mitigation, help the human owner verify the actual customer/system recovery signal, not only that a command succeeded.

## Learning

For meaningful incidents propose:

- regression test
- monitoring/alert improvement
- runbook update
- `docs/solutions/` entry
- ADR/architecture update if a systemic boundary changed
- tracked follow-up actions with owners

AI assists; the human incident owner remains accountable for incident command and closure.
