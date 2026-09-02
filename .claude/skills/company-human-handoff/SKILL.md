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

### Verification
Exact commands/tests run and their result. Do not claim tests were run if they were not.

### User evidence
For user-facing work, state browser scenarios tested and any untested cases.

### Database impact
State migration/schema impact, compatibility, and deploy-order concerns.

### Security/privacy impact
State whether auth, authorization, secrets, sensitive data, CI/security controls, or dependencies changed.

### Risk
Classify low, medium, or high with a short rationale.

### Rollback
Explain the safe rollback or forward-fix approach.

### Known limitations
List unresolved issues, assumptions, or follow-up work.

### Human gate
Finish with exactly this meaning:

> Automated implementation and checks are complete to the extent reported above. Human review is required before merge.
