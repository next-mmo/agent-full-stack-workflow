---
name: company-security-check
description: Security-focused repository review checklist. Use for auth, authorization, secrets, sensitive data, API boundaries, dependencies, migrations, CI controls, or before handoff of medium/high-risk changes.
---

# Security check

Review the changed behavior, not only syntax.

## Check

- authentication assumptions
- backend authorization enforcement
- object/resource ownership checks
- input validation and unexpected fields
- injection and unsafe query construction
- sensitive data exposure in responses
- secrets/tokens/passwords in code or logs
- error and stack-trace leakage
- CORS/origin changes
- dependency or supply-chain impact
- destructive migration or data-loss risk
- CI, permissions, CODEOWNERS, and repository-control changes

## Severity

Classify findings as critical, high, medium, or low and explain exploitability/impact rather than using severity labels alone.

## Rules

Do not silently fix a security-sensitive product decision by changing intended behavior. Surface the issue and required decision.

Do not call the result a security approval. Automated security review is evidence for the human reviewer, not authorization to merge or release.

For high-risk changes, explicitly recommend the responsible human/domain owner review before merge.
