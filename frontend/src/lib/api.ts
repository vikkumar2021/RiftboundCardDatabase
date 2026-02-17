import axios from 'axios';
import { CardSearchFilters, CardSearchResult } from '@riftbound-atlas/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

export const cardApi = {
  getCards: async (page: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get<CardSearchResult>('/api/cards', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getCardById: async (id: string) => {
    const response = await apiClient.get(`/api/cards/${id}`);
    return response.data;
  },

  searchCards: async (filters: CardSearchFilters, page: number = 1, pageSize: number = 20) => {
    const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) };
    if (filters.domains?.length) params.domains = filters.domains.join(',');
    if (filters.rarities?.length) params.rarities = filters.rarities.join(',');
    if (filters.types?.length) params.types = filters.types.join(',');
    if (filters.expansions?.length) params.expansions = filters.expansions.join(',');
    if (filters.textSearch) params.q = filters.textSearch;

    const response = await apiClient.get<CardSearchResult>('/api/cards/search', { params });
    return response.data;
  },
};

export const filterApi = {
  getDomains: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/filters/domains');
    return response.data;
  },
  getRarities: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/filters/rarities');
    return response.data;
  },
  getTypes: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/filters/types');
    return response.data;
  },
  getArtists: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/filters/artists');
    return response.data;
  },
  getExpansions: async () => {
    const response = await apiClient.get('/api/filters/expansions');
    return response.data;
  },
};
