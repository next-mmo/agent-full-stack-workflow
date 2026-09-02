# Enterprise AI Delivery Workflow

## Principle

AI accelerates engineering work. Humans retain accountability.

## Standard flow

```text
Ticket / request
    ↓
AI + human requirement clarification
    ↓
/ce-brainstorm
    ↓
Human checks product intent if needed
    ↓
/ce-plan
    ↓
Human may review plan for high-risk work
    ↓
/ce-work
    ↓
Local tests
    ↓
/ce-simplify-code
    ↓
/ce-code-review
    ↓
/ce-test-browser
    ↓
/ce-compound
    ↓
Pull request
    ↓
CI
    ↓
CODEOWNERS / human review
    ↓
Human approval
    ↓
Merge
```

## Risk tiers

### Low
Examples:
- copy change
- isolated UI polish
- non-sensitive test improvements

Human review still required.

### Medium
Examples:
- normal feature work
- API changes
- schema additions
- dependency upgrades

Require CI + human approval.

### High
Examples:
- authentication
- authorization
- payments
- secrets
- destructive migrations
- infra/security configuration
- personal/sensitive data flows

Require:
- explicit plan review
- security-focused review
- CODEOWNER approval
- rollback plan
- production validation plan

## AI may do

- inspect code
- draft plans
- implement changes
- write tests
- run tests
- review code
- document decisions
- prepare PRs

## AI may not autonomously do

- merge PRs
- approve PRs
- bypass review
- bypass CI
- rotate production secrets
- run destructive production migrations
- weaken security controls
