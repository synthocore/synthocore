# SynthoCore — Architecture

## Overview

SynthoCore is built as an **event-driven, autonomous pipeline** that bridges social signal detection and on-chain token deployment. The system is designed for sub-10-second end-to-end latency with high availability.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SynthoCore Agent                             │
│                                                                     │
│  ┌──────────────┐    ┌────────────────┐    ┌────────────────────┐  │
│  │TwitterIngester│   │    Pipeline     │    │     REST API       │  │
│  │ (X/Twitter)  │──▶ │  (8 Stages)    │──▶ │  /v1/deploy, etc.  │  │
│  └──────────────┘    └────────────────┘    └────────────────────┘  │
│                              │                                      │
│               ┌──────────────┼──────────────┐                      │
│               ▼              ▼              ▼                       │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│         │  CDP SDK │  │ Bankr.bot│  │  Doppler │                  │
│         │(Coinbase)│  │(Liquidity│  │(Secrets) │                  │
│         └──────────┘  └──────────┘  └──────────┘                  │
│               │                                                     │
│               ▼                                                     │
│         ┌──────────────────────────┐                               │
│         │       Base Network        │                               │
│         │  (OP Stack L2, EVM)       │                               │
│         └──────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Stages

### Stage 1: Ingest
- **Input:** Raw tweet from X/Twitter API v2 filtered stream
- **Output:** Structured signal `{ id, text, url, engagement }`
- **Target latency:** <100ms

### Stage 2: Classify
- **Input:** Signal text
- **Process:** NLP model assigns confidence score (0–1)
- **Output:** Scored signal `{ score: 0.94 }`
- **Target latency:** <200ms

### Stage 3: Validate
- **Checks:** Duplicate detection, spam heuristics, engagement gate
- **Target latency:** <50ms

### Stage 4: Configure
- **Process:** Doppler injects deployment parameters (supply, gas limit, etc.)
- **Target latency:** <100ms (cached after first sync)

### Stage 5: Provision Wallet
- **Process:** Coinbase CDP SDK provisions an isolated MPC wallet
- **Output:** `AgentWallet { id, address }`
- **Target latency:** <1,500ms

### Stage 6: Deploy Contract
- **Process:** CDP SDK calls `wallet.deployToken()` — ERC-20 on Base
- **Output:** `{ address, txHash }`
- **Target latency:** <3,000ms (Base block time ~2s)

### Stage 7: Seed Liquidity
- **Process:** Bankr.bot seeds initial ETH/token liquidity pool
- **Target latency:** <1,000ms

### Stage 8: Broadcast
- **Process:** Token metadata pushed to API + X reply
- **Output:** `DeployedToken` event emitted on agent event bus
- **Target latency:** <200ms

**Total target latency: ~6,000ms**

---

## Coinbase Developer Platform (CDP) Integration

CDP is the backbone of SynthoCore's wallet and contract infrastructure:

- **MPC Wallets:** Each deployment uses a freshly provisioned MPC wallet via `Wallet.create()`. Private keys are managed by Coinbase's MPC network — never exposed.
- **Token Deployment:** `wallet.deployToken()` deploys the ERC-20 to Base in a single SDK call.
- **Network:** Targets Base mainnet (`Coinbase.networks.BaseMainnet`) or Sepolia for testing.

---

## Security Model

- Secrets: Doppler → in-memory only. Never written to disk.
- Wallets: CDP MPC — private keys never touch application memory.
- API: JWT-authenticated. Rate-limited at the gateway layer.
- Contracts: Audited. No admin upgrade keys.

---

## Scalability

- Multiple SynthoAgent instances can run concurrently, each with their own CDP wallet pool.
- Redis is used for global signal deduplication across instances.
- The Pipeline is stateless — horizontally scalable.

---

© 2026 SynthoCore — [synthocore.xyz](https://synthocore.xyz) · [@syntho_core](https://x.com/syntho_core)
