/**
 * SynthoCore Agent — Type Definitions
 */

export type Network = 'base-mainnet' | 'base-sepolia';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface SignalConfig {
  /** Signal source to monitor */
  source: 'twitter';
  /** Keywords / cashtags to watch */
  keywords: string[];
  /** Minimum tweet engagement (likes + retweets) to pass the threshold gate */
  minEngagement: number;
  /** NLP score threshold (0–1). Only signals above this value trigger a deploy */
  scoreThreshold: number;
}

export interface AgentConfig {
  /** Coinbase Developer Platform API key */
  cdpApiKey: string;
  /** Coinbase Developer Platform API secret */
  cdpApiSecret: string;
  /** Bankr.bot access token */
  bankrToken: string;
  /** Doppler service token (optional — can also be set via DOPPLER_TOKEN env var) */
  dopplerToken?: string;
  /** Target network */
  network: Network;
  /** Signal configuration */
  signal: SignalConfig;
  /** Maximum concurrent token deployments */
  maxConcurrentDeploys?: number;
  /** Log level */
  logLevel?: LogLevel;
}

export interface DeployedToken {
  /** ERC-20 token name */
  name: string;
  /** Ticker symbol */
  symbol: string;
  /** Total supply (in token units) */
  supply: string;
  /** Deployed contract address on Base */
  address: `0x${string}`;
  /** Deployment transaction hash */
  txHash: `0x${string}`;
  /** Network deployed to */
  network: Network;
  /** ISO 8601 timestamp */
  deployedAt: string;
  /** Basescan URL */
  explorerUrl: string;
  /** Wall-clock deployment latency in milliseconds */
  latencyMs: number;
  /** Source tweet URL that triggered the deploy */
  sourceTweetUrl?: string;
}

export type PipelineStage =
  | 'ingest'
  | 'classify'
  | 'validate'
  | 'configure'
  | 'provision'
  | 'deploy'
  | 'liquidity'
  | 'broadcast';

export interface PipelineResult {
  success: boolean;
  token?: DeployedToken;
  error?: string;
  stageTimings: Partial<Record<PipelineStage, number>>;
  totalLatencyMs: number;
}

export interface AgentEvents {
  'signal:detected': (tweet: { id: string; text: string; url: string; score: number }) => void;
  'signal:rejected': (reason: string) => void;
  'token:deploying': (meta: { name: string; symbol: string }) => void;
  'token:deployed': (token: DeployedToken) => void;
  'token:failed': (error: Error) => void;
  'agent:started': () => void;
  'agent:stopped': () => void;
  error: (err: Error) => void;
}
