import axios from 'axios';
import { Card, CardSearchFilters, CardSearchResult } from '@riftbound-atlas/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cardApi = {
  getCards: async (page: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get<CardSearchResult>('/api/cards', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getCardById: async (id: string) => {
    const response = await apiClient.get<Card>(`/api/cards/${id}`);
    return response.data;
  },

  searchCards: async (filters: CardSearchFilters, page: number = 1, pageSize: number = 20) => {
    const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) };

    if (filters.costMin !== undefined) params.costMin = String(filters.costMin);
    if (filters.costMax !== undefined) params.costMax = String(filters.costMax);
    if (filters.factions?.length) params.factions = filters.factions.join(',');
    if (filters.rarities?.length) params.rarities = filters.rarities.join(',');
    if (filters.types?.length) params.types = filters.types.join(',');
    if (filters.keywords?.length) params.keywords = filters.keywords.join(',');
    if (filters.sets?.length) params.sets = filters.sets.join(',');
    if (filters.textSearch) params.q = filters.textSearch;

    const response = await apiClient.get<CardSearchResult>('/api/cards/search', { params });
    return response.data;
  },
};

export const filterApi = {
  getFactions: async () => {
    const response = await apiClient.get<string[]>('/api/filters/factions');
    return response.data;
  },

  getRarities: async () => {
    const response = await apiClient.get<string[]>('/api/filters/rarities');
    return response.data;
  },

  getTypes: async () => {
    const response = await apiClient.get<string[]>('/api/filters/types');
    return response.data;
  },

  getKeywords: async () => {
    const response = await apiClient.get('/api/filters/keywords');
    return response.data;
  },

  getSets: async () => {
    const response = await apiClient.get('/api/filters/sets');
    return response.data;
  },
};
