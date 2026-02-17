import { create } from 'zustand';
import { CardSearchFilters } from '@riftbound-atlas/shared';

interface SearchState {
  filters: CardSearchFilters;
  setFilters: (filters: CardSearchFilters) => void;
  updateFilter: <K extends keyof CardSearchFilters>(
    key: K,
    value: CardSearchFilters[K]
  ) => void;
  clearFilters: () => void;
}

const defaultFilters: CardSearchFilters = {};

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
}));
