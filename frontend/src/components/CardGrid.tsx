'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cardApi } from '@/lib/api';
import { useSearchStore } from '@/store/searchStore';
import Link from 'next/link';

const rarityColors: Record<string, string> = {
  Common: 'text-gray-400',
  Uncommon: 'text-green-400',
  Rare: 'text-blue-400',
  Epic: 'text-purple-400',
  Showcase: 'text-yellow-400',
};

const domainColors: Record<string, string> = {
  Body: 'text-orange-400',
  Calm: 'text-teal-400',
  Chaos: 'text-red-400',
  Colorless: 'text-gray-400',
  Fury: 'text-rose-500',
  Mind: 'text-indigo-400',
  Order: 'text-amber-400',
};

function CardCard({ card }: { card: any }) {
  return (
    <Link href={`/cards/${card.publicCode}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
        <div className="relative aspect-[2/3] bg-gray-800">
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm mb-1 truncate">{card.name}</h3>
          <div className="flex items-center gap-1 text-xs flex-wrap">
            <span className={domainColors[card.domain] || 'text-gray-400'}>{card.domain}</span>
            <span className="text-gray-600">·</span>
            <span className={rarityColors[card.rarity] || 'text-gray-400'}>{card.rarity}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{card.type}</div>
        </div>
      </div>
    </Link>
  );
}

export function CardGrid() {
  const { filters } = useSearchStore();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['cards', filters, page],
    queryFn: () => {
      const hasFilters = Object.values(filters).some(
        (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
      );
      return hasFilters
        ? cardApi.searchCards(filters, page, pageSize)
        : cardApi.getCards(page, pageSize);
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg animate-pulse">
            <div className="aspect-[2/3] bg-gray-800" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">Failed to load cards</p>
        <p className="text-gray-500 mt-2">
          Make sure the backend is running and the database has been synced.
        </p>
      </div>
    );
  }

  if (!data || data.cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No cards found</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{data.total} cards found</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {data.cards.map((card: any) => (
          <CardCard key={card.id} card={card} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
