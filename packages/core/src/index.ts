/**
 * @synthocore/core
 *
 * Autonomous AI Agent runtime that turns any X/Tweet into a live Base token
 * in ~6 seconds. Powered by Coinbase Developer Platform (CDP), Bankr.bot,
 * and Doppler.
 *
 * @see https://docs.synthocore.ai
 * @license Apache-2.0
 */

export { SynthoAgent } from './agent/SynthoAgent.js';
export { Pipeline } from './pipeline/Pipeline.js';
export { CDPClient } from './cdp/CDPClient.js';
export { BankrClient } from './bankr/BankrClient.js';
export { DopplerClient } from './doppler/DopplerClient.js';
export { TwitterIngester } from './twitter/TwitterIngester.js';

export type {
  AgentConfig,
  AgentEvents,
  DeployedToken,
  SignalConfig,
  PipelineStage,
  PipelineResult,
} from './agent/types.js';
