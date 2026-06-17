# SynthoCore API Reference

Base URL: `https://api.synthocore.ai/v1`

All endpoints require a valid API key passed in the `Authorization` header:

```
Authorization: Bearer <SYNCO_API_KEY>
```

---

## Authentication

### `POST /auth/token`

Exchange credentials for an API token.

**Request:**
```json
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

---

## Tokens

### `POST /v1/deploy`

Manually trigger a token deployment.

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Token name (e.g. "PepeCoin") |
| `symbol` | string | ✅ | Token symbol (e.g. "PEPE", max 10 chars) |
| `supply` | string | ✅ | Total supply in token units |
| `network` | string | ✅ | `base-mainnet` or `base-sepolia` |
| `meta.tweet_url` | string | ❌ | Source tweet URL |
| `meta.description` | string | ❌ | Token description |
| `meta.image_url` | string | ❌ | Token logo image URL |

**Response `200 OK`:**
```json
{
  "success": true,
  "token": {
    "name": "PepeCoin",
    "symbol": "PEPE",
    "address": "0x1a2b3c4d...",
    "txHash": "0xabcdef12...",
    "network": "base-mainnet",
    "deployedAt": "2025-01-15T12:00:00.000Z",
    "explorerUrl": "https://basescan.org/token/0x1a2b3c4d...",
    "latencyMs": 5840
  }
}
```

---

### `GET /v1/tokens`

List all tokens deployed by your account.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `limit` | number | Results per page (default: 20, max: 100) |
| `offset` | number | Pagination offset |
| `network` | string | Filter by network |

**Response:**
```json
{
  "tokens": [...],
  "total": 1247,
  "limit": 20,
  "offset": 0
}
```

---

### `GET /v1/tokens/:address`

Get details and live analytics for a specific token.

**Response:**
```json
{
  "token": {
    "name": "PepeCoin",
    "symbol": "PEPE",
    "address": "0x1a2b3c4d...",
    "txHash": "0xabcdef12...",
    "network": "base-mainnet",
    "deployedAt": "2025-01-15T12:00:00.000Z",
    "explorerUrl": "https://basescan.org/token/0x1a2b3c4d...",
    "latencyMs": 5840
  },
  "analytics": {
    "holders": 142,
    "transfers": 891,
    "liquidityUsd": 4200.50,
    "volumeUsd24h": 18750.00,
    "priceUsd": 0.00042
  }
}
```

---

## Agent

### `GET /v1/agent/status`

Check agent health and pipeline statistics.

**Response:**
```json
{
  "status": "running",
  "uptime": 86400,
  "tokensDeployed": 1247,
  "avgLatencyMs": 5920,
  "signalsProcessed": 48302,
  "pipeline": {
    "ingest": "healthy",
    "classify": "healthy",
    "validate": "healthy",
    "configure": "healthy",
    "provision": "healthy",
    "deploy": "healthy",
    "liquidity": "healthy",
    "broadcast": "healthy"
  },
  "integrations": {
    "cdp": "healthy",
    "bankr": "healthy",
    "doppler": "healthy",
    "twitter": "healthy"
  }
}
```

---

### `POST /v1/agent/start`

Start the autonomous agent (if stopped).

### `POST /v1/agent/stop`

Gracefully stop the autonomous agent.

---

## Webhooks

### `POST /v1/webhooks`

Register a webhook to receive real-time token deployment events.

**Request:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["token.deployed", "signal.detected"],
  "secret": "your_webhook_secret"
}
```

**Webhook Payload (`token.deployed`):**
```json
{
  "event": "token.deployed",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "data": {
    "token": { ... }
  }
}
```

Payloads are signed with HMAC-SHA256 using your webhook secret. Verify using the `X-SynthoCore-Signature` header.

---

## Rate Limits

| Tier | Requests/min | Deploys/hour |
|---|---|---|
| Free | 60 | 10 |
| Pro | 600 | 100 |
| Enterprise | Unlimited | Unlimited |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1705320060
```

---

## Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Invalid or expired API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `DEPLOY_FAILED` | 422 | Token deployment failed (see `error.details`) |
| `CDP_ERROR` | 502 | Coinbase CDP upstream error |
| `INTERNAL_ERROR` | 500 | Internal server error |
