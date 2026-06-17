import EventEmitter from 'eventemitter3';
import type { SignalConfig } from '../agent/types.js';

interface TweetSignal {
  id: string;
  text: string;
  url: string;
  score: number;
}

interface IngesterEvents {
  signal: (tweet: TweetSignal) => void;
  error: (err: Error) => void;
  connected: () => void;
  disconnected: () => void;
}

/**
 * TwitterIngester
 *
 * Connects to the X/Twitter API v2 filtered stream endpoint and
 * emits `signal` events for tweets that pass NLP classification.
 *
 * Uses an internal score model to assign each tweet a confidence
 * score (0–1). Only tweets above `config.scoreThreshold` are emitted.
 */
export class TwitterIngester extends EventEmitter<IngesterEvents> {
  private readonly config: SignalConfig;
  private connected_ = false;
  private abortController: AbortController | null = null;

  constructor(config: SignalConfig) {
    super();
    this.config = config;
  }

  /**
   * Connect to the X/Twitter filtered stream.
   */
  async connect(): Promise<void> {
    await this._upsertStreamRules();
    this.connected_ = true;
    this.emit('connected');
    void this._streamLoop();
  }

  /**
   * Disconnect and stop ingesting.
   */
  async disconnect(): Promise<void> {
    this.connected_ = false;
    this.abortController?.abort();
    this.emit('disconnected');
  }

  get isConnected(): boolean {
    return this.connected_;
  }

  private async _upsertStreamRules(): Promise<void> {
    const bearerToken = process.env['TWITTER_BEARER_TOKEN'];
    if (!bearerToken) return;

    const rules = this.config.keywords.map((kw) => ({
      value: `${kw} lang:en -is:retweet`,
      tag: `synthocore:${kw}`,
    }));

    await fetch('https://api.twitter.com/2/tweets/search/stream/rules', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ add: rules }),
    });
  }

  private async _streamLoop(): Promise<void> {
    const bearerToken = process.env['TWITTER_BEARER_TOKEN'];
    if (!bearerToken) return;

    this.abortController = new AbortController();

    while (this.connected_) {
      try {
        const response = await fetch(
          'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics,author_id,entities',
          {
            headers: { Authorization: `Bearer ${bearerToken}` },
            signal: this.abortController.signal,
          }
        );

        if (!response.body) break;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (this.connected_) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line) as {
                data: { id: string; text: string; public_metrics: { like_count: number; retweet_count: number } };
              };
              this._handleTweet(parsed.data);
            } catch {
              // Heartbeat or malformed line — skip
            }
          }
        }
      } catch (err: unknown) {
        if ((err as { name?: string }).name === 'AbortError') break;
        this.emit('error', err instanceof Error ? err : new Error(String(err)));
        // Reconnect backoff
        await new Promise((r) => setTimeout(r, 5_000));
      }
    }
  }

  private _handleTweet(tweet: {
    id: string;
    text: string;
    public_metrics: { like_count: number; retweet_count: number };
  }): void {
    const engagement = tweet.public_metrics.like_count + tweet.public_metrics.retweet_count;
    if (engagement < this.config.minEngagement) return;

    const score = this._scoreSignal(tweet.text, engagement);
    if (score < this.config.scoreThreshold) return;

    this.emit('signal', {
      id: tweet.id,
      text: tweet.text,
      url: `https://x.com/i/web/status/${tweet.id}`,
      score,
    });
  }

  private _scoreSignal(text: string, engagement: number): number {
    // Simplified scoring heuristic — replace with fine-tuned model in production
    let score = 0.5;
    if (engagement > 1000) score += 0.2;
    else if (engagement > 500) score += 0.1;
    else if (engagement > 100) score += 0.05;

    const hasKeyword = this.config.keywords.some((kw) =>
      text.toLowerCase().includes(kw.toLowerCase())
    );
    if (hasKeyword) score += 0.2;

    const hasLaunchSignal = /launch|deploy|mint|token|pump/i.test(text);
    if (hasLaunchSignal) score += 0.1;

    return Math.min(score, 1.0);
  }
}
