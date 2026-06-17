# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (latest) | ✅ Active support |
| 0.x | ⚠️ Critical fixes only |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities via public GitHub issues.**

If you discover a security vulnerability in SynthoCore, report it responsibly:

**Email:** [security@synthocore.xyz](mailto:security@synthocore.xyz)

Include in your report:
- A description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested mitigations (optional)

We will acknowledge receipt within **48 hours** and provide a response within **7 days**, including our assessment and remediation timeline.

---

## Security Practices

### Secret Management
- All secrets are managed via **Doppler** — no plaintext credentials are stored in code or config files
- `.env` files are gitignored and must never be committed

### Wallet Security
- Agent wallets use **Coinbase Developer Platform (CDP) MPC technology**
- Private keys are never exposed to the application layer
- Each agent instance uses an isolated wallet

### Smart Contract Security
- Token factory contracts are audited before production deployment
- Contract code is published and verified on Basescan
- No upgradeable proxy patterns — no admin key risk

### API Security
- All endpoints require signed JWT authentication
- Rate limiting enforced at the gateway layer
- Request payloads are validated and sanitized

### Infrastructure
- All services communicate over TLS
- Dependencies audited on every CI build (`pnpm audit`)

---

## Disclosure Policy

SynthoCore follows **coordinated disclosure**:

1. Reporter submits vulnerability via email
2. We acknowledge within 48 hours
3. We investigate and develop a fix
4. We release a patch and notify the reporter
5. We publish a security advisory after users have had time to update
6. Credit is given to the reporter (unless they prefer anonymity)

---

## Bug Bounty

We run a private bug bounty program. Qualifying vulnerabilities are rewarded in **$SYNCO**:

| Severity | Reward |
|---|---|
| Critical | $5,000 – $25,000 in $SYNCO |
| High | $1,000 – $5,000 in $SYNCO |
| Medium | $250 – $1,000 in $SYNCO |
| Low | Recognition |

Contact [security@synthocore.xyz](mailto:security@synthocore.xyz) for program details.

---

© 2026 SynthoCore
