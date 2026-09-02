---
name: company-human-handoff
description: Prepare a review-ready engineering handoff for a human after implementation and automated checks. Use at the end of substantial work before a pull request is reviewed.
disable-model-invocation: true
---

# Human handoff

Prepare a concise, evidence-based review package. Do not merge or self-approve.

## Required handoff

Include:

### Summary
What changed and why.

### Scope
Main files/modules and intentionally excluded work.

### Source context
Relevant Jira/requirement, Figma/design, plan, ADR, or explicitly state N/A.

### Architecture impact
State whether boundaries, dependency direction, API/data flows, trust boundaries, integrations, or deployment topology changed and whether `docs/ARCHITECTURE.md`/ADR was updated.

### Verification
Exact commands/tests run and their result. Do not claim tests were run if they were not.

### User evidence
For user-facing work, state browser scenarios tested and any untested cases.

### Database impact
State migration/schema impact, compatibility, deploy-order concerns, and destructive-change/backup requirements when relevant.

### Security/privacy/AI-data impact
State whether auth, authorization, secrets, sensitive data, CI/security controls, dependencies, external integrations, AI provider/data flows, or production access changed.

If company data leaves a new trust boundary/provider, state the data class, destination, purpose, and whether company approval is known or still required.

### Dependency / supply-chain impact
State dependency/lockfile/Action changes and relevant dependency-review/security/license concerns.

### Release / operations impact
State deployment/configuration/monitoring/runbook/rollback impact, or explicitly state none.

### Risk
Classify low, medium, or high with a short rationale and main failure/blast-radius concern.

### Rollback
Explain the safe rollback, disable, or forward-fix approach and irreversible consequences if any.

### Known limitations
List unresolved issues, assumptions, company/admin configuration, or follow-up work.

### Human gates
Name the human roles/decisions still required, such as normal reviewer, CODEOWNER, architecture owner, security/privacy owner, release owner, or company AI/data-policy owner.

Finish with exactly this meaning:

> Automated implementation and checks are complete to the extent reported above. Human review is required before merge.
