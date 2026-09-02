# Environments and Configuration

This starter defines the policy for environment separation but does not invent a production cloud/provider.

## Environment classes

Recommended minimum:

| Environment | Purpose | Data | Access |
|---|---|---|---|
| Local | developer work | synthetic/local only | developer |
| CI | automated verification | disposable test data | CI identity |
| Development | shared integration | non-production | engineering |
| Staging | production-like verification | sanitized/non-production | controlled team |
| Production | customer/business workload | real governed data | least-privilege production roles |

Small teams may combine development/staging temporarily, but must not blur production access/data into local/CI use.

## Configuration principles

- environment-specific values come from environment/configuration, not source-code branches
- secrets use the approved secret manager
- `.env.example` documents names/examples only
- fail clearly when required configuration is missing
- validate configuration at service startup when practical
- do not silently default security-sensitive production settings

## Secret separation

Use separate credentials per environment.

Do not reuse production:

- database credentials
- OAuth clients/secrets
- signing keys
- third-party API keys
- service accounts

in local, CI, or development environments.

## Data separation

Production customer data must not be copied to local/CI by default.

If production-derived data is necessary for a legitimate test/debug workflow, require an approved sanitization/minimization process and document access/retention.

## Database migrations

The same reviewed migration files move through environments.

Recommended flow:

```text
migration PR
  ↓
CI disposable DB
  ↓
development
  ↓
staging verification
  ↓
human release decision
  ↓
production
```

Do not create a different hand-edited production schema from what source control describes.

## Feature flags

Use feature flags/config switches when they materially reduce rollout risk, not as permanent hidden branches of unowned behavior.

For each significant flag define:

- owner
- default per environment
- removal/expiry condition
- security implications

Do not use a frontend-only flag as a security/authorization boundary.

## Production access

Normal coding-agent repository permissions do not imply production access.

Production access should be:

- least privilege
- attributable to a human/service identity
- logged/auditable
- time-bounded/approved where company policy requires

Agents may assist an authorized human through approved production tooling, but must follow `docs/OPERATIONS.md` and `docs/RELEASES.md`.

## Before production

Fill in the real product's:

```text
Development URL/account: <...>
Staging URL/account:     <...>
Production URL/account:  <...>
Secret manager:          <...>
Deployment system:       <...>
Observability system:    <...>
On-call system:          <...>
```

Keep secret values out of this document.
