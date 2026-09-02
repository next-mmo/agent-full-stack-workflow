# Security Policy

## Reporting

Do not report suspected vulnerabilities in public issues.

Use the company's private security reporting channel.

## AI-assisted changes

AI-generated or AI-assisted code is held to the same security requirements as human-authored code.

AI must not autonomously:

- disclose or rotate production secrets
- weaken authentication or authorization
- disable security checks
- approve security-sensitive changes
- merge security-sensitive changes
- execute destructive production operations

Changes involving authentication, authorization, secrets, sensitive data, payments,
or infrastructure security require a human security review.

## Secrets

Never commit real credentials.

Use environment variables and the company's approved secret manager in deployed environments.
