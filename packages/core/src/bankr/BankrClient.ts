import axios, { type AxiosInstance } from 'axios';
import type { Network } from '../agent/types.js';

interface BankrConfig {
  token: string;
  baseUrl?: string;
}

interface SeedLiquidityParams {
  tokenAddress: `0x${string}`;
  network: Network;
  amountEth?: string;
}

/**
 * BankrClient
 *
 * DeFi-native transaction routing via Bankr.bot.
 * Handles post-deployment liquidity seeding on Base DEXs.
 *
 * @see https://bankr.bot
 */
export class BankrClient {
  private readonly http: AxiosInstance;

  constructor(config: BankrConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl ?? 'https://api.bankr.bot/v1',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'synthocore/1.0.0',
      },
      timeout: 30_000,
    });
  }

  /**
   * Seed initial liquidity for a newly deployed token.
   * Bankr.bot handles DEX selection and optimal routing automatically.
   */
  async seedLiquidity(params: SeedLiquidityParams): Promise<void> {
    await this.http.post('/liquidity/seed', {
      token_address: params.tokenAddress,
      network: params.network,
      amount_eth: params.amountEth ?? '0.01',
    });
  }

  /**
   * Execute a token swap via Bankr.bot's optimal routing engine.
   */
  async swap(params: {
    tokenIn: `0x${string}`;
    tokenOut: `0x${string}`;
    amountIn: string;
    network: Network;
    slippage?: number;
  }): Promise<{ txHash: `0x${string}` }> {
    const { data } = await this.http.post<{ tx_hash: `0x${string}` }>('/swap', {
      token_in: params.tokenIn,
      token_out: params.tokenOut,
      amount_in: params.amountIn,
      network: params.network,
      slippage_bps: (params.slippage ?? 0.5) * 100,
    });
    return { txHash: data.tx_hash };
  }
}
