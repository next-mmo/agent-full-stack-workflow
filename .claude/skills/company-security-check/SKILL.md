---
name: company-security-check
description: Security-focused repository review checklist. Use for auth, authorization, secrets, sensitive data, AI/provider data flows, API boundaries, dependencies, migrations, CI controls, or before handoff of medium/high-risk changes.
---

# Security check

Read `docs/SECURITY_MODEL.md` and, when AI/external tools may receive company data, `docs/AI_DATA_POLICY.md`.

Review the changed behavior, not only syntax.

## Check

- authentication assumptions
- backend authorization enforcement
- object/resource ownership and tenant-boundary checks
- input validation and unexpected fields
- injection and unsafe query construction
- sensitive data exposure in responses
- secrets/tokens/passwords in code, logs, prompts, or tool calls
- what company data leaves which trust boundary/provider and why
- whether the AI/provider/account is approved for that data class
- prompt injection / external-content exfiltration paths
- error and stack-trace leakage
- CORS/origin changes
- dependency or supply-chain impact
- destructive migration or data-loss risk
- CI, permissions, CODEOWNERS, and repository-control changes
- whether repository/agent access is being mistaken for production authorization

## Severity

Classify findings as critical, high, medium, or low and explain exploitability/impact rather than using severity labels alone.

## Rules

Do not silently fix a security-sensitive product decision by changing intended behavior. Surface the issue and required decision.

Do not call the result a security approval. Automated security review is evidence for the human reviewer, not authorization to merge or release.

For high-risk changes, explicitly recommend the responsible human/domain/security owner review before merge.

If a new AI provider, model, plugin, or MCP flow would receive confidential/restricted company data and provider/data-policy approval is not established, treat that as a human security/governance decision rather than assuming access is allowed.
