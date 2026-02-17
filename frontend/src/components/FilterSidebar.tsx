'use client';

import { useQuery } from '@tanstack/react-query';
import { filterApi } from '@/lib/api';
import { useSearchStore } from '@/store/searchStore';

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[] | undefined;
  selected: string[] | undefined;
  onToggle: (value: string, checked: boolean) => void;
}) {
  if (!options || options.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{title}</label>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {options.map((option) => (
          <label key={option} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={selected?.includes(option) || false}
              onChange={(e) => onToggle(option, e.target.checked)}
              className="mr-2 rounded bg-gray-800 border-gray-600"
            />
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterSidebar() {
  const { filters, updateFilter, clearFilters } = useSearchStore();

  const { data: domains } = useQuery({ queryKey: ['domains'], queryFn: filterApi.getDomains });
  const { data: rarities } = useQuery({ queryKey: ['rarities'], queryFn: filterApi.getRarities });
  const { data: types } = useQuery({ queryKey: ['types'], queryFn: filterApi.getTypes });
  const { data: expansions } = useQuery({ queryKey: ['expansions'], queryFn: filterApi.getExpansions });

  const toggleFilter = (
    key: 'domains' | 'rarities' | 'types' | 'expansions',
    value: string,
    checked: boolean
  ) => {
    const current = filters[key] || [];
    const updated = checked ? [...current, value] : current.filter((v) => v !== value);
    updateFilter(key, updated.length > 0 ? updated : undefined);
  };

  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded-full">{activeCount}</span>
          )}
        </h2>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300">
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        title="Domain"
        options={domains}
        selected={filters.domains}
        onToggle={(val, checked) => toggleFilter('domains', val, checked)}
      />

      <FilterGroup
        title="Rarity"
        options={rarities}
        selected={filters.rarities}
        onToggle={(val, checked) => toggleFilter('rarities', val, checked)}
      />

      <FilterGroup
        title="Type"
        options={types}
        selected={filters.types}
        onToggle={(val, checked) => toggleFilter('types', val, checked)}
      />

      <FilterGroup
        title="Expansion"
        options={expansions?.map((e: any) => e.name)}
        selected={filters.expansions}
        onToggle={(val, checked) => toggleFilter('expansions', val, checked)}
      />
    </div>
  );
}
