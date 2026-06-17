# Getting Started with SynthoCore

This guide walks you through setting up SynthoCore and deploying your first token autonomously from an X/Twitter signal.

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** — [Download](https://nodejs.org)
- **A Coinbase Developer Platform account** — [Sign up](https://cdp.coinbase.com)
- **A Bankr.bot account** — [Sign up](https://bankr.bot)
- **A Doppler account** — [Sign up](https://doppler.com)
- **X/Twitter Developer App** with Filtered Stream access — [Apply](https://developer.x.com)

---

## Step 1 — Install the CLI

```bash
npm install -g @synthocore/cli
```

Verify the installation:

```bash
synco --version
# 1.0.0
```

---

## Step 2 — Authenticate

```bash
synco auth login
```

This opens a browser window to complete OAuth authentication with SynthoCore.

---

## Step 3 — Initialize an Agent

```bash
synco init my-first-agent --network base-sepolia
cd my-first-agent
```

This creates a directory with the following structure:

```
my-first-agent/
├── synco.config.ts    # Agent configuration
├── .env.example       # Environment variable template
└── README.md
```

---

## Step 4 — Configure Credentials

We strongly recommend using **Doppler** for secret management:

```bash
# Install Doppler CLI
brew install dopplerhq/cli/doppler

# Log in and set up your project
doppler login
doppler setup
```

Or set environment variables manually (development only):

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required credentials:

| Variable | Where to get it |
|---|---|
| `CDP_API_KEY` | [cdp.coinbase.com](https://cdp.coinbase.com) → API Keys |
| `CDP_API_SECRET` | Same as above |
| `BANKR_TOKEN` | [bankr.bot](https://bankr.bot) → Settings |
| `TWITTER_BEARER_TOKEN` | [developer.x.com](https://developer.x.com) → Your App |

---

## Step 5 — Start the Agent

```bash
# With Doppler (recommended)
doppler run -- synco start

# Or with .env
synco start
```

You'll see:

```
  SynthoCore agent is running ⚡
  Network:  base-sepolia
  Listening for X/Twitter signals...
  Press Ctrl+C to stop
```

---

## Step 6 — Deploy Your First Token

Once the agent is running, send a test tweet containing your configured keyword (e.g. `$SYNCO`):

```
Just launched $SYNCO — the future of autonomous token deployment! 🚀
```

Within ~6 seconds, the agent will:

1. Detect the tweet
2. Score it above threshold
3. Provision a CDP wallet
4. Deploy an ERC-20 to Base Sepolia
5. Seed liquidity via Bankr.bot
6. Log the token address

```
✅ Token deployed: SYNCO @ 0x1a2b3c4d...
   TX:      https://sepolia.basescan.org/tx/0xabcdef...
   Latency: 5,840ms
```

---

## Next Steps

- **Read the [Architecture docs](architecture.md)** to understand the 8-step pipeline
- **Explore the [API Reference](api-reference.md)** for REST endpoints
- **Check the [SDK docs](https://docs.synthocore.ai/sdk)** to integrate programmatically
- **Join [Discord](https://discord.gg/synthocore)** for community support

---

## Troubleshooting

### Agent not detecting tweets

1. Verify `TWITTER_BEARER_TOKEN` is set and valid
2. Check your X Developer App has Filtered Stream v2 access enabled
3. Confirm your keywords are in the stream rules: `synco status`

### CDP wallet provisioning fails

1. Verify `CDP_API_KEY` and `CDP_API_SECRET` are correct
2. Check your CDP account has Base network enabled
3. Review CDP dashboard for any account-level restrictions

### Bankr.bot liquidity seeding fails

1. Ensure your Bankr.bot account has sufficient balance on Base Sepolia
2. Verify `BANKR_TOKEN` is valid

For more help: [Discord #dev-help](https://discord.gg/synthocore) or [GitHub Issues](https://github.com/synthocore/synthocore/issues)
