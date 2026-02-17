import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '../utils/logger';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class RiotApiClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || '';
    this.baseUrl = process.env.RIOT_API_BASE_URL || 'https://ddragon.leagueoflegends.com/cdn';

    if (!this.apiKey) {
      logger.warn('RIOT_API_KEY not set. API calls will fail.');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Riot-Token': this.apiKey,
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    // Intercept responses to track rate limits
    this.client.interceptors.response.use(
      (response) => {
        const limit = response.headers['x-app-rate-limit'];
        const count = response.headers['x-app-rate-limit-count'];
        const retryAfter = response.headers['retry-after'];

        if (limit && count) {
          const [limitValue, window] = limit.split(':');
          const [countValue] = count.split(':');
          this.rateLimitInfo = {
            limit: parseInt(limitValue),
            remaining: parseInt(limitValue) - parseInt(countValue),
            reset: retryAfter ? Date.now() + parseInt(retryAfter) * 1000 : Date.now() + parseInt(window) * 1000,
          };
        }

        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          logger.warn(`Rate limited. Waiting ${waitTime}ms before retry.`);
          await this.sleep(waitTime);
          return this.client.request(error.config!);
        }

        if (error.response?.status === 403) {
          logger.error('API key invalid or expired');
          throw new Error('Invalid API key');
        }

        throw error;
      }
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Riot API error: ${error.message}`, {
          endpoint,
          status: error.response?.status,
        });
      }
      throw error;
    }
  }

  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  // Check API version
  async checkApiVersion(): Promise<string> {
    try {
      // This is a placeholder - adjust based on actual Riot API structure
      const response = await this.get<{ version: string }>('/api/versions.json');
      return response.version || 'unknown';
    } catch (error) {
      logger.warn('Could not fetch API version', { error });
      return 'unknown';
    }
  }
}

export const riotApiClient = new RiotApiClient();
