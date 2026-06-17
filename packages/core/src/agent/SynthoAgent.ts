import EventEmitter from 'eventemitter3';
import pino from 'pino';
import type { AgentConfig, AgentEvents, DeployedToken, PipelineResult } from './types.js';
import { Pipeline } from '../pipeline/Pipeline.js';
import { CDPClient } from '../cdp/CDPClient.js';
import { BankrClient } from '../bankr/BankrClient.js';
import { DopplerClient } from '../doppler/DopplerClient.js';
import { TwitterIngester } from '../twitter/TwitterIngester.js';

/**
 * SynthoAgent
 *
 * The core autonomous agent that orchestrates the full 8-step pipeline:
 * Ingest → Classify → Validate → Configure → Provision → Deploy → Liquidity → Broadcast
 *
 * Powered by Coinbase Developer Platform (CDP) for wallet provisioning
 * and smart-contract deployment on Base.
 *
 * @example
 * ```typescript
 * const agent = new SynthoAgent({
 *   cdpApiKey: process.env.CDP_API_KEY!,
 *   cdpApiSecret: process.env.CDP_API_SECRET!,
 *   bankrToken: process.env.BANKR_TOKEN!,
 *   network: 'base-mainnet',
 *   signal: {
 *     source: 'twitter',
 *     keywords: ['$SYNCO', 'synthocore'],
 *     minEngagement: 100,
 *     scoreThreshold: 0.82,
 *   },
 * });
 *
 * agent.on('token:deployed', (token) => {
 *   console.log(`Deployed ${token.symbol} @ ${token.address}`);
 * });
 *
 * await agent.start();
 * ```
 */
export class SynthoAgent extends EventEmitter<AgentEvents> {
  private readonly config: AgentConfig;
  private readonly logger: pino.Logger;
  private readonly pipeline: Pipeline;
  private readonly cdp: CDPClient;
  private readonly bankr: BankrClient;
  private readonly doppler: DopplerClient;
  private readonly ingester: TwitterIngester;
  private running = false;
  private activeDeploys = 0;

  constructor(config: AgentConfig) {
    super();
    this.config = config;
    this.logger = pino({ level: config.logLevel ?? 'info', name: 'synthocore' });

    this.cdp = new CDPClient({
      apiKey: config.cdpApiKey,
      apiSecret: config.cdpApiSecret,
      network: config.network,
    });

    this.bankr = new BankrClient({ token: config.bankrToken });

    this.doppler = new DopplerClient({
      token: config.dopplerToken ?? process.env['DOPPLER_TOKEN'] ?? '',
    });

    this.ingester = new TwitterIngester(config.signal);

    this.pipeline = new Pipeline({
      cdp: this.cdp,
      bankr: this.bankr,
      doppler: this.doppler,
      network: config.network,
    });

    this._bindIngesterEvents();
  }

  /**
   * Start the autonomous agent. Begins listening for signals
   * and processing deployments.
   */
  async start(): Promise<void> {
    if (this.running) {
      this.logger.warn('Agent is already running');
      return;
    }

    this.logger.info({ network: this.config.network }, 'SynthoCore agent starting');

    await this.doppler.sync();
    await this.cdp.initialize();
    await this.ingester.connect();

    this.running = true;
    this.emit('agent:started');
    this.logger.info('SynthoCore agent started — listening for signals ⚡');
  }

  /**
   * Gracefully stop the agent.
   */
  async stop(): Promise<void> {
    this.logger.info('Stopping SynthoCore agent...');
    this.running = false;
    await this.ingester.disconnect();
    this.emit('agent:stopped');
    this.logger.info('Agent stopped.');
  }

  /**
   * Whether the agent is currently running.
   */
  get isRunning(): boolean {
    return this.running;
  }

  private _bindIngesterEvents(): void {
    this.ingester.on('signal', async (signal) => {
      this.emit('signal:detected', signal);

      const maxConcurrent = this.config.maxConcurrentDeploys ?? 5;
      if (this.activeDeploys >= maxConcurrent) {
        this.logger.warn({ activeDeploys: this.activeDeploys }, 'Max concurrent deploys reached — queuing');
        return;
      }

      this.activeDeploys++;
      try {
        const result: PipelineResult = await this.pipeline.run(signal);

        if (result.success && result.token) {
          this.emit('token:deployed', result.token);
          this.logger.info(
            { address: result.token.address, latencyMs: result.totalLatencyMs },
            `Token deployed: ${result.token.symbol} ⚡`
          );
        } else {
          this.emit('signal:rejected', result.error ?? 'Pipeline failed');
          this.logger.warn({ error: result.error }, 'Pipeline did not produce a token');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.emit('token:failed', error);
        this.emit('error', error);
        this.logger.error({ err }, 'Unhandled pipeline error');
      } finally {
        this.activeDeploys--;
      }
    });

    this.ingester.on('error', (err) => {
      this.emit('error', err);
      this.logger.error({ err }, 'Ingester error');
    });
  }
}
