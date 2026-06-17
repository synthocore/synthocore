# Changelog

All notable changes to SynthoCore are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [1.0.0] — 2026-01-15

### 🚀 Initial Production Release

**SynthoCore v1.0** — Autonomous AI × On-Chain Execution, powered by Coinbase Developer Platform.

#### Added
- Core autonomous agent runtime with 8-step pipeline
- X/Twitter signal ingestion and real-time processing
- NLP signal classification with configurable score threshold
- Coinbase Developer Platform (CDP) MPC wallet provisioning
- ERC-20 token factory deployment on Base mainnet and Sepolia
- Bankr.bot integration for automated liquidity routing post-deployment
- Doppler integration for production-safe secret management
- REST API v1 with token deployment, status, and analytics endpoints
- `@synthocore/sdk` — TypeScript/JavaScript SDK (npm)
- `@synthocore/cli` — Command-line interface (`synco` command)
- Bankr.bot skill integration (`/install synthocore`)
- Docker Compose configuration for local development
- Comprehensive test suite (unit + integration)

#### Performance
- Average token deployment latency: **~5.84 seconds** from signal detection to Base mainnet
- Throughput: up to 5 concurrent deployments per agent instance

---

## [0.9.0-beta] — 2026-01-01

### Beta Release

#### Added
- Pipeline stages 1–6 (ingest through deploy)
- Coinbase CDP wallet integration (beta)
- Base Sepolia testnet deployment support
- Alpha SDK release

#### Fixed
- Race condition in duplicate signal detection
- CDP wallet provisioning timeout on high-load scenarios
- Twitter API rate limit backoff logic

---

## [0.5.0-alpha] — 2025-12-01

### Alpha Release

#### Added
- Initial proof-of-concept autonomous pipeline
- Twitter API v2 integration
- Manual ERC-20 deployment via CDP
- Basic REST API structure

---

[1.0.0]: https://github.com/synthocore/synthocore/releases/tag/v1.0.0
[0.9.0-beta]: https://github.com/synthocore/synthocore/releases/tag/v0.9.0-beta
[0.5.0-alpha]: https://github.com/synthocore/synthocore/releases/tag/v0.5.0-alpha
