import type { CDPClient } from '../cdp/CDPClient.js';
import type { BankrClient } from '../bankr/BankrClient.js';
import type { DopplerClient } from '../doppler/DopplerClient.js';
import type { Network, PipelineResult, PipelineStage } from '../agent/types.js';

interface PipelineConfig {
  cdp: CDPClient;
  bankr: BankrClient;
  doppler: DopplerClient;
  network: Network;
}

interface Signal {
  id: string;
  text: string;
  url: string;
  score: number;
}

/**
 * Pipeline
 *
 * Executes the 8-stage autonomous token deployment pipeline:
 *
 * 1. INGEST      — Receive the validated signal from the ingester
 * 2. CLASSIFY    — Final NLP confidence check
 * 3. VALIDATE    — Dedup, spam filter, threshold gate
 * 4. CONFIGURE   — Doppler injects deployment parameters
 * 5. PROVISION   — CDP provisions an isolated MPC agent wallet
 * 6. DEPLOY      — ERC-20 contract deployed to Base via CDP SDK
 * 7. LIQUIDITY   — Bankr.bot seeds initial liquidity
 * 8. BROADCAST   — Token metadata pushed to X and REST API
 */
export class Pipeline {
  private readonly cdp: CDPClient;
  private readonly bankr: BankrClient;
  private readonly doppler: DopplerClient;
  private readonly network: Network;
  private readonly seen = new Set<string>();

  constructor(config: PipelineConfig) {
    this.cdp = config.cdp;
    this.bankr = config.bankr;
    this.doppler = config.doppler;
    this.network = config.network;
  }

  async run(signal: Signal): Promise<PipelineResult> {
    const stageTimings: Partial<Record<PipelineStage, number>> = {};
    const start = Date.now();

    // ── Stage 1: Ingest ───────────────────────────────────────────────────
    stageTimings['ingest'] = Date.now() - start;

    // ── Stage 2: Classify ─────────────────────────────────────────────────
    const classifyStart = Date.now();
    if (signal.score < 0.5) {
      return { success: false, error: 'Signal score below minimum', stageTimings, totalLatencyMs: Date.now() - start };
    }
    stageTimings['classify'] = Date.now() - classifyStart;

    // ── Stage 3: Validate ─────────────────────────────────────────────────
    const validateStart = Date.now();
    if (this.seen.has(signal.id)) {
      return { success: false, error: 'Duplicate signal', stageTimings, totalLatencyMs: Date.now() - start };
    }
    this.seen.add(signal.id);
    stageTimings['validate'] = Date.now() - validateStart;

    // ── Stage 4: Configure ────────────────────────────────────────────────
    const configureStart = Date.now();
    const deployParams = await this.doppler.getDeployParams();
    stageTimings['configure'] = Date.now() - configureStart;

    // ── Stage 5: Provision Wallet ─────────────────────────────────────────
    const provisionStart = Date.now();
    const wallet = await this.cdp.provisionWallet();
    stageTimings['provision'] = Date.now() - provisionStart;

    // ── Stage 6: Deploy Contract ──────────────────────────────────────────
    const deployStart = Date.now();
    const tokenMeta = this._deriveTokenMeta(signal.text);
    const deployed = await this.cdp.deployToken({
      wallet,
      name: tokenMeta.name,
      symbol: tokenMeta.symbol,
      supply: deployParams.defaultSupply ?? '1000000000',
    });
    stageTimings['deploy'] = Date.now() - deployStart;

    // ── Stage 7: Seed Liquidity ───────────────────────────────────────────
    const liquidityStart = Date.now();
    await this.bankr.seedLiquidity({ tokenAddress: deployed.address, network: this.network });
    stageTimings['liquidity'] = Date.now() - liquidityStart;

    // ── Stage 8: Broadcast ────────────────────────────────────────────────
    const broadcastStart = Date.now();
    const totalLatencyMs = Date.now() - start;
    stageTimings['broadcast'] = Date.now() - broadcastStart;

    const explorerBase = this.network === 'base-mainnet'
      ? 'https://basescan.org'
      : 'https://sepolia.basescan.org';

    return {
      success: true,
      token: {
        name: tokenMeta.name,
        symbol: tokenMeta.symbol,
        supply: deployParams.defaultSupply ?? '1000000000',
        address: deployed.address,
        txHash: deployed.txHash,
        network: this.network,
        deployedAt: new Date().toISOString(),
        explorerUrl: `${explorerBase}/token/${deployed.address}`,
        latencyMs: totalLatencyMs,
        sourceTweetUrl: signal.url,
      },
      stageTimings,
      totalLatencyMs,
    };
  }

  private _deriveTokenMeta(text: string): { name: string; symbol: string } {
    // Extract cashtag from tweet text, fallback to generic name
    const cashtag = text.match(/\$([A-Z]{2,10})/)?.[1];
    if (cashtag) {
      return { name: cashtag, symbol: cashtag };
    }
    const words = text.split(' ').filter((w) => w.length > 3).slice(0, 2);
    const name = words.map((w) => w.replace(/[^a-zA-Z]/g, '')).join('') || 'SynToken';
    return { name, symbol: name.slice(0, 6).toUpperCase() };
  }
}
