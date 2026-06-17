# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (latest) | ✅ Active support |
| 0.x | ⚠️ Critical fixes only |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities via public GitHub issues.**

If you discover a security vulnerability in SynthoCore, please report it responsibly:

**Email:** [security@synthocore.ai](mailto:security@synthocore.ai)

Include in your report:
- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested mitigations (optional)

We will acknowledge receipt within **48 hours** and provide a detailed response within **7 days**, including our assessment and a planned remediation timeline.

---

## Security Practices

SynthoCore is designed with security as a first-class concern:

### Secret Management
- All secrets are managed via **Doppler** — no plaintext credentials are ever stored in code, configuration files, or environment variables on disk
- `.env` files are gitignored and should never be committed

### Wallet Security
- Agent wallets are provisioned using **Coinbase Developer Platform (CDP) MPC technology**
- Private keys are never exposed to the application layer
- Each agent instance operates with an isolated wallet with minimum required permissions

### Smart Contract Security
- All token factory contracts are audited before production deployment
- Contract code is published and verified on Basescan
- Upgradeable proxy patterns are avoided to prevent admin key risk

### API Security
- All API endpoints require signed JWT authentication
- Rate limiting is enforced at the API gateway layer
- Request payloads are validated and sanitized

### Infrastructure
- All services communicate over TLS
- Database credentials are rotated quarterly
- Dependency audits run on every CI build (`pnpm audit`)

---

## Disclosure Policy

SynthoCore follows a **coordinated disclosure** model:

1. Reporter submits vulnerability via email
2. SynthoCore team acknowledges within 48 hours
3. We investigate and develop a fix
4. We release a patch and notify the reporter
5. We publish a security advisory after users have had time to update
6. Credit is given to the reporter (unless they prefer anonymity)

---

## Bug Bounty

We operate a private bug bounty program. If you responsibly disclose a qualifying vulnerability, we will reward you based on severity:

| Severity | Reward |
|---|---|
| Critical | $5,000 – $25,000 in $SYNCO |
| High | $1,000 – $5,000 in $SYNCO |
| Medium | $250 – $1,000 in $SYNCO |
| Low | Recognition + swag |

Contact [security@synthocore.ai](mailto:security@synthocore.ai) to learn more about the program scope.
