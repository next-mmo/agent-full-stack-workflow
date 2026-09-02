# GitHub Repository Protection Checklist

Configure these settings in GitHub after creating the repository.

## Protect `main`

Recommended ruleset:

- Require a pull request before merging
- Require at least 1 approving review
- Require 2 approvals for high-risk repositories if your team size allows
- Dismiss stale approvals when new commits are pushed
- Require review from Code Owners
- Require conversation resolution before merging
- Require status checks to pass
- Require branches to be up to date before merging
- Block force pushes
- Block branch deletion
- Restrict direct pushes to `main`
- Do not allow AI/bot identities to bypass the ruleset

Required CI check:

```text
CI / validate
```

## Human approval

AI review is supplemental.

At least one authorized human reviewer must approve before merge.

For high-risk changes, require the relevant CODEOWNER or security owner.

## Suggested high-risk paths

```text
apps/api/src/**/auth*
apps/api/prisma/**
.github/**
SECURITY.md
deployment/**
infra/**
```

## Merge strategy

Prefer squash merge for normal feature branches unless your organization has a different standard.

A PR should contain:

- linked ticket
- clear scope
- test evidence
- migration notes
- security impact
- rollback plan
