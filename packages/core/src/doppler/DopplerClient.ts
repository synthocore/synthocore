import axios, { type AxiosInstance } from 'axios';

interface DopplerConfig {
  token: string;
}

interface DeployParams {
  defaultSupply: string;
  gasLimit: number;
  maxConcurrentDeploys: number;
}

/**
 * DopplerClient
 *
 * Securely fetches runtime secrets and deployment parameters
 * from Doppler. Secrets are pulled at boot time and held in-memory —
 * never written to disk or environment files.
 *
 * @see https://docs.doppler.com
 */
export class DopplerClient {
  private readonly http: AxiosInstance;
  private secrets: Record<string, string> = {};

  constructor(config: DopplerConfig) {
    this.http = axios.create({
      baseURL: 'https://api.doppler.com/v3',
      auth: {
        username: config.token,
        password: '',
      },
      timeout: 10_000,
    });
  }

  /**
   * Sync secrets from Doppler into memory.
   * Called once at agent startup.
   */
  async sync(): Promise<void> {
    if (!this.http.defaults.auth?.username) {
      // Token not configured — skip Doppler sync (use env vars directly)
      return;
    }

    try {
      const { data } = await this.http.get<{ secrets: Record<string, { computed: string }> }>(
        '/configs/config/secrets/download',
        { params: { format: 'json' } }
      );

      this.secrets = Object.fromEntries(
        Object.entries(data.secrets).map(([k, v]) => [k, v.computed])
      );
    } catch {
      // Fall back to process.env if Doppler is unavailable
      this.secrets = {};
    }
  }

  /**
   * Get a secret value by key.
   * Falls back to process.env if not found in Doppler.
   */
  get(key: string): string {
    return this.secrets[key] ?? process.env[key] ?? '';
  }

  /**
   * Get standardized deployment parameters from Doppler config.
   */
  async getDeployParams(): Promise<DeployParams> {
    return {
      defaultSupply: this.get('DEFAULT_TOKEN_SUPPLY') || '1000000000',
      gasLimit: parseInt(this.get('DEPLOY_GAS_LIMIT') || '500000', 10),
      maxConcurrentDeploys: parseInt(this.get('MAX_CONCURRENT_DEPLOYS') || '5', 10),
    };
  }
}
