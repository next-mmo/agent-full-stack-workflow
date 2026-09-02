# AI Review Policy

## Purpose

AI is a contributor and reviewer aid, not the final authority.

## Separation of duties

The same AI session may implement and run an AI review, but that review does not count as independent approval.

Human review is mandatory.

## Required human review

All pull requests require a human.

Additional domain review is required for:

| Change | Required human |
|---|---|
| Normal frontend | Frontend reviewer |
| Normal backend | Backend reviewer |
| Database migration | Backend/data owner |
| Auth/authz | Backend + security owner |
| CI/repository rules | Platform owner |
| Sensitive data | Security/privacy owner |

## Evidence expected from AI

Before handoff, AI should provide:

1. plan followed
2. files changed
3. tests run
4. test results
5. known risks
6. migration impact
7. security impact
8. rollback notes
9. unresolved questions

## Prohibited AI claims

AI must not say:

- "approved"
- "safe for production"
- "ready to merge"

unless clearly qualified as an AI assessment and still pending human approval.

Preferred wording:

> Automated implementation and checks are complete. Human review is required before merge.
