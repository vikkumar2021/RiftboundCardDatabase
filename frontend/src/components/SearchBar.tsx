'use client';

import { useState } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { useQuery } from '@tanstack/react-query';
import { cardApi } from '@/lib/api';

export function SearchBar() {
  const [localQuery, setLocalQuery] = useState('');
  const { filters, updateFilter } = useSearchStore();

  const { data: searchResults } = useQuery({
    queryKey: ['cardSearch', localQuery],
    queryFn: () => cardApi.searchCards({ textSearch: localQuery }, 1, 5),
    enabled: localQuery.length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('textSearch', localQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search cards..."
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchResults && searchResults.cards.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
          {searchResults.cards.map((card) => (
            <a
              key={card.id}
              href={`/cards/${card.id}`}
              className="block px-4 py-2 hover:bg-gray-800 border-b border-gray-800 last:border-b-0"
            >
              <div className="font-medium">{card.name}</div>
              <div className="text-sm text-gray-400">{card.type}</div>
            </a>
          ))}
        </div>
      )}
    </form>
  );
}
