import type { Network } from '../agent/types.js';

interface CDPConfig {
  apiKey: string;
  apiSecret: string;
  network: Network;
}

interface AgentWallet {
  id: string;
  address: `0x${string}`;
}

interface DeployTokenParams {
  wallet: AgentWallet;
  name: string;
  symbol: string;
  supply: string;
}

interface DeployedContract {
  address: `0x${string}`;
  txHash: `0x${string}`;
}

/**
 * CDPClient
 *
 * Wraps the Coinbase Developer Platform (CDP) SDK to provide:
 * - MPC agent wallet provisioning
 * - ERC-20 token factory deployment on Base
 *
 * CDP handles all private key management via MPC — keys are never
 * exposed to the application layer.
 *
 * @see https://docs.cdp.coinbase.com
 */
export class CDPClient {
  private readonly config: CDPConfig;
  private initialized = false;

  constructor(config: CDPConfig) {
    this.config = config;
  }

  /**
   * Initialize the CDP SDK with API credentials.
   * Must be called before any wallet or contract operations.
   */
  async initialize(): Promise<void> {
    // Coinbase CDP SDK initialization
    // Credentials are passed in-memory — never written to disk
    const { Coinbase } = await import('@coinbase/coinbase-sdk');
    Coinbase.configure({
      apiKeyName: this.config.apiKey,
      privateKey: this.config.apiSecret,
    });
    this.initialized = true;
  }

  /**
   * Provision a new isolated MPC wallet for the current agent deployment.
   * Each token deployment gets its own wallet to prevent cross-contamination.
   */
  async provisionWallet(): Promise<AgentWallet> {
    this._assertInitialized();
    const { Coinbase, Wallet } = await import('@coinbase/coinbase-sdk');

    const networkId = this.config.network === 'base-mainnet'
      ? Coinbase.networks.BaseMainnet
      : Coinbase.networks.BaseSepolia;

    const wallet = await Wallet.create({ networkId });
    const address = await wallet.getDefaultAddress();

    return {
      id: wallet.getId()!,
      address: address.getId() as `0x${string}`,
    };
  }

  /**
   * Deploy a new ERC-20 token contract via CDP on Base.
   */
  async deployToken(params: DeployTokenParams): Promise<DeployedContract> {
    this._assertInitialized();
    const { Wallet } = await import('@coinbase/coinbase-sdk');

    const wallet = await Wallet.fetch(params.wallet.id);
    const contract = await wallet.deployToken({
      name: params.name,
      symbol: params.symbol,
      totalSupply: BigInt(params.supply),
    });

    await contract.wait();

    return {
      address: contract.getContractAddress() as `0x${string}`,
      txHash: contract.getTransaction()?.getTransactionHash() as `0x${string}`,
    };
  }

  private _assertInitialized(): void {
    if (!this.initialized) {
      throw new Error('CDPClient must be initialized before use. Call initialize() first.');
    }
  }
}
