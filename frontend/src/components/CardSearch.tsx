'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';

export function CardSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { updateFilter } = useSearchStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('textSearch', searchQuery);
    router.push('/cards');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cards by name, text, or flavor..."
          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
