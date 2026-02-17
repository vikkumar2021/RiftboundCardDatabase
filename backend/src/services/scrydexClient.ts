import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '../utils/logger';
import {
  ScrydexCardResponse,
  ScrydexExpansionResponse,
  ScrydexPaginatedResponse,
} from '@riftbound-atlas/shared';

export class ScrydexClient {
  private client: AxiosInstance;

  constructor() {
    const apiKey = process.env.SCRYDEX_API_KEY || '';
    const teamId = process.env.SCRYDEX_TEAM_ID || '';

    if (!apiKey || !teamId) {
      logger.warn('SCRYDEX_API_KEY or SCRYDEX_TEAM_ID not set. API calls may fail.');
    }

    this.client = axios.create({
      baseURL: 'https://api.scrydex.com/riftbound/v1',
      headers: {
        'X-Api-Key': apiKey,
        'X-Team-ID': teamId,
        Accept: 'application/json',
      },
      timeout: 15000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          logger.warn(`Scrydex rate limited. Waiting ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return this.client.request(error.config!);
        }
        throw error;
      }
    );
  }

  /**
   * Fetch a single card by ID (e.g. "OGN-296")
   */
  async getCard(id: string): Promise<ScrydexCardResponse> {
    const response = await this.client.get<ScrydexCardResponse>(`/cards/${id}`);
    return response.data;
  }

  /**
   * Fetch all cards with pagination. Returns up to 250 per page.
   */
  async getCards(
    page: number = 1,
    pageSize: number = 250,
    query?: string
  ): Promise<ScrydexPaginatedResponse<ScrydexCardResponse>> {
    const params: Record<string, string | number> = { page, page_size: pageSize };
    if (query) params.q = query;

    const response =
      await this.client.get<ScrydexPaginatedResponse<ScrydexCardResponse>>('/cards', { params });
    return response.data;
  }

  /**
   * Fetch cards for a specific expansion
   */
  async getExpansionCards(
    expansionCode: string,
    page: number = 1,
    pageSize: number = 250
  ): Promise<ScrydexPaginatedResponse<ScrydexCardResponse>> {
    const response =
      await this.client.get<ScrydexPaginatedResponse<ScrydexCardResponse>>(
        `/expansions/${expansionCode}/cards`,
        { params: { page, page_size: pageSize } }
      );
    return response.data;
  }

  /**
   * Fetch all expansions
   */
  async getExpansions(): Promise<ScrydexPaginatedResponse<ScrydexExpansionResponse>> {
    const response =
      await this.client.get<ScrydexPaginatedResponse<ScrydexExpansionResponse>>('/expansions');
    return response.data;
  }

  /**
   * Fetch a single expansion by ID
   */
  async getExpansion(id: string): Promise<ScrydexExpansionResponse> {
    const response = await this.client.get<ScrydexExpansionResponse>(`/expansions/${id}`);
    return response.data;
  }

  /**
   * Fetch ALL cards across all pages for a given expansion
   */
  async getAllExpansionCards(expansionCode: string): Promise<ScrydexCardResponse[]> {
    const allCards: ScrydexCardResponse[] = [];
    let page = 1;
    const pageSize = 250;

    while (true) {
      logger.info(`Fetching ${expansionCode} cards page ${page}...`);
      const result = await this.getExpansionCards(expansionCode, page, pageSize);
      allCards.push(...result.data);

      if (allCards.length >= result.totalCount || result.data.length < pageSize) {
        break;
      }
      page++;

      // Respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    logger.info(`Fetched ${allCards.length} total cards from ${expansionCode}`);
    return allCards;
  }
}

export const scrydexClient = new ScrydexClient();
