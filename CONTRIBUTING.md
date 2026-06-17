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
- [Requesting Features](#requesting-features)

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

Copy the example environment file and fill in your credentials:

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

# Run tests with coverage
pnpm test:coverage
```

---

## How to Contribute

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/synthocore/synthocore/labels/good%20first%20issue) — these are ideal starting points for new contributors.

### Areas Where We Need Help

- 🧠 **NLP / AI** — Improving signal classification accuracy
- 🔵 **CDP Integration** — Expanding Coinbase Developer Platform feature usage
- 📡 **Signal Sources** — Adding Farcaster, Lens, Telegram adapters
- 🧪 **Testing** — Unit and integration test coverage
- 📖 **Documentation** — Guides, examples, API docs
- 🎨 **Dashboard UI** — React components for the web dashboard

---

## Pull Request Guidelines

1. **Branch naming:** `feat/`, `fix/`, `docs/`, `chore/`, `refactor/` prefixes required
   ```bash
   git checkout -b feat/farcaster-signal-adapter
   ```

2. **Keep PRs focused** — one feature or fix per PR

3. **Include tests** — all new functionality must have corresponding tests

4. **Update documentation** — if your change affects public APIs or behavior

5. **Pass CI** — ensure all checks pass before requesting review

6. **Fill out the PR template** — provide context, screenshots (if UI), and a summary of changes

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <short summary>

[optional body]

[optional footer]
```

**Types:**

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code logic change |
| `refactor` | Code change, neither fix nor feature |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |
| `perf` | Performance improvement |

**Examples:**

```
feat(cdp): add MPC wallet rotation on agent restart
fix(pipeline): handle duplicate tweet detection race condition
docs(sdk): add TypeScript usage examples to README
chore: upgrade viem to 2.x
```

---

## Reporting Bugs

Please use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- Your environment (OS, Node.js version, network)
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs or error output

**Security vulnerabilities** should be reported privately to [security@synthocore.ai](mailto:security@synthocore.ai) — do NOT open a public issue.

---

## Requesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Please:

- Describe the problem you're solving
- Explain your proposed solution
- Note any alternatives you considered

---

## Questions?

- [Discord](https://discord.gg/synthocore) — `#dev-help` channel
- [GitHub Discussions](https://github.com/synthocore/synthocore/discussions)
- [X / Twitter](https://x.com/SynthoCoreAI)

We appreciate every contribution — from typo fixes to major new features. Thank you for building with us. ⚡
