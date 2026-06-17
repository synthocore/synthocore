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
│  │  TwitterIngester│  │    Pipeline     │    │     REST API       │  │
│  │  (X Firehose)│───▶│  (8 Stages)    │───▶│  /v1/deploy, etc.  │  │
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

## Pipeline Stages Detail

### Stage 1: Ingest
- **Input:** Raw tweet from X/Twitter Firehose (filtered stream API v2)
- **Output:** Structured signal object `{ id, text, url, engagement }`
- **Latency target:** <100ms

### Stage 2: Classify
- **Input:** Signal text
- **Process:** NLP transformer model assigns confidence score (0–1)
- **Output:** Scored signal `{ score: 0.94 }`
- **Latency target:** <200ms

### Stage 3: Validate
- **Checks:** Duplicate detection (Redis SET), spam heuristics, engagement gate
- **Output:** Pass/fail with reason
- **Latency target:** <50ms

### Stage 4: Configure
- **Process:** Doppler injects deployment parameters (supply, gas limit, etc.)
- **Output:** Deployment config object
- **Latency target:** <100ms (cached after first sync)

### Stage 5: Provision Wallet
- **Process:** Coinbase CDP SDK provisions a new isolated MPC wallet
- **Output:** `AgentWallet { id, address }`
- **Latency target:** <1,500ms

### Stage 6: Deploy Contract
- **Process:** CDP SDK calls `wallet.deployToken()` — ERC-20 factory on Base
- **Output:** `{ address, txHash }`
- **Latency target:** <3,000ms (Base block time ~2s)

### Stage 7: Seed Liquidity
- **Process:** Bankr.bot seeds initial ETH/token liquidity pool
- **Output:** Confirmation
- **Latency target:** <1,000ms

### Stage 8: Broadcast
- **Process:** Token metadata pushed to internal API + X reply
- **Output:** `DeployedToken` object emitted on agent event bus
- **Latency target:** <200ms

**Total target latency: ~6,000ms**

---

## Coinbase Developer Platform (CDP) Integration

CDP is the backbone of SynthoCore's wallet and contract infrastructure:

- **MPC Wallets:** Each deployment uses a freshly provisioned MPC wallet via `Wallet.create()`. Private keys are managed by Coinbase's MPC network — never exposed.
- **Token Deployment:** `wallet.deployToken()` compiles and deploys the ERC-20 bytecode to Base in a single SDK call.
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
- Redis is used for global deduplication across instances.
- The Pipeline is stateless — horizontally scalable.
