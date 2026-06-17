# Contributing to SynthoCore

Thank you for your interest in contributing to SynthoCore! We're building the most advanced autonomous AI × Web3 agent infrastructure, and community contributions are essential to that mission.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

All contributors are expected to uphold our community standards: be respectful, constructive, and collaborative. We have zero tolerance for harassment or discrimination of any kind.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/synthocore.git
   cd synthocore
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/synthocore/synthocore.git
   ```
4. **Install dependencies:**
   ```bash
   pnpm install
   ```

---

## Development Setup

### Requirements

- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 8.0.0
- **Docker** (for local Postgres + Redis)
- A [Coinbase Developer Platform](https://cdp.coinbase.com) account
- A [Doppler](https://doppler.com) account

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

We strongly recommend using [Doppler](https://doppler.com) for secret management:

```bash
doppler setup
doppler run -- pnpm dev
```

### Running Locally

```bash
# Start infrastructure (Postgres, Redis)
docker-compose up -d

# Build all packages
pnpm build

# Run in development mode
pnpm dev

# Run tests
pnpm test
```

---

## How to Contribute

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/synthocore/synthocore/labels/good%20first%20issue).

### Areas Where We Need Help

- 🧠 **NLP / AI** — Improving signal classification accuracy
- 🔵 **CDP Integration** — Expanding Coinbase Developer Platform feature usage
- 📡 **Signal Sources** — Adding Farcaster, Telegram adapters
- 🧪 **Testing** — Unit and integration test coverage
- 📖 **Documentation** — Guides, examples, API docs

---

## Pull Request Guidelines

1. **Branch naming:** `feat/`, `fix/`, `docs/`, `chore/`, `refactor/` prefixes required
2. **Keep PRs focused** — one feature or fix per PR
3. **Include tests** — all new functionality must have corresponding tests
4. **Update documentation** — if your change affects public APIs or behavior
5. **Pass CI** — ensure all checks pass before requesting review

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <short summary>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

**Examples:**

```
feat(cdp): add MPC wallet rotation on agent restart
fix(pipeline): handle duplicate tweet detection race condition
docs(sdk): add TypeScript usage examples
```

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include steps to reproduce, environment details, and relevant logs.

**Security vulnerabilities** must be reported privately to [security@synthocore.xyz](mailto:security@synthocore.xyz) — do NOT open a public issue.

---

## Questions?

- [GitHub Issues](https://github.com/synthocore/synthocore/issues)
- [X / Twitter — @syntho_core](https://x.com/syntho_core)
- [synthocore.xyz](https://synthocore.xyz)
