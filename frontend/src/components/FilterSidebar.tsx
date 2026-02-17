'use client';

import { useQuery } from '@tanstack/react-query';
import { filterApi } from '@/lib/api';
import { useSearchStore } from '@/store/searchStore';

export function FilterSidebar() {
  const { filters, updateFilter, clearFilters } = useSearchStore();

  const { data: factions } = useQuery({
    queryKey: ['factions'],
    queryFn: filterApi.getFactions,
  });

  const { data: rarities } = useQuery({
    queryKey: ['rarities'],
    queryFn: filterApi.getRarities,
  });

  const { data: types } = useQuery({
    queryKey: ['types'],
    queryFn: filterApi.getTypes,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Clear all
        </button>
      </div>

      {/* Cost Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Cost</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.costMin || ''}
            onChange={(e) =>
              updateFilter('costMin', e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.costMax || ''}
            onChange={(e) =>
              updateFilter('costMax', e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
          />
        </div>
      </div>

      {/* Factions */}
      {factions && (
        <div>
          <label className="block text-sm font-medium mb-2">Faction</label>
          <div className="space-y-1">
            {factions.map((faction) => (
              <label key={faction} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.factions?.includes(faction) || false}
                  onChange={(e) => {
                    const current = filters.factions || [];
                    const updated = e.target.checked
                      ? [...current, faction]
                      : current.filter((f) => f !== faction);
                    updateFilter('factions', updated.length > 0 ? updated : undefined);
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{faction}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rarities */}
      {rarities && (
        <div>
          <label className="block text-sm font-medium mb-2">Rarity</label>
          <div className="space-y-1">
            {rarities.map((rarity) => (
              <label key={rarity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.rarities?.includes(rarity) || false}
                  onChange={(e) => {
                    const current = filters.rarities || [];
                    const updated = e.target.checked
                      ? [...current, rarity]
                      : current.filter((r) => r !== rarity);
                    updateFilter('rarities', updated.length > 0 ? updated : undefined);
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{rarity}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Types */}
      {types && (
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="space-y-1">
            {types.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types?.includes(type) || false}
                  onChange={(e) => {
                    const current = filters.types || [];
                    const updated = e.target.checked
                      ? [...current, type]
                      : current.filter((t) => t !== type);
                    updateFilter('types', updated.length > 0 ? updated : undefined);
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
