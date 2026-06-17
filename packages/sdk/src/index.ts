/**
 * @synthocore/sdk
 *
 * Official TypeScript SDK for SynthoCore.
 *
 * @example
 * ```typescript
 * import { SynthoCore } from '@synthocore/sdk';
 *
 * const agent = new SynthoCore({
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
 *   console.log(`✅ ${token.symbol} deployed @ ${token.address}`);
 *   console.log(`   latency: ${token.latencyMs}ms`);
 * });
 *
 * await agent.start();
 * ```
 *
 * @see https://docs.synthocore.ai/sdk
 * @license Apache-2.0
 */

export { SynthoAgent as SynthoCore } from '@synthocore/core';
export type {
  AgentConfig as SynthoCoreConfig,
  AgentEvents,
  DeployedToken,
  SignalConfig,
  Network,
} from '@synthocore/core';
