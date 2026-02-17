'use client';

import { useQuery } from '@tanstack/react-query';
import { cardApi } from '@/lib/api';
import { useSearchStore } from '@/store/searchStore';
import { Card } from '@riftbound-atlas/shared';
import Link from 'next/link';
import Image from 'next/image';

function CardCard({ card }: { card: Card }) {
  return (
    <Link href={`/cards/${card.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
        <div className="relative aspect-[2/3] bg-gray-800">
          {card.imageSmallUrl && (
            <Image
              src={card.imageSmallUrl}
              alt={card.name}
              fill
              className="object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{card.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{card.cost} cost</span>
            <span>•</span>
            <span>{card.faction}</span>
            <span>•</span>
            <span>{card.rarity}</span>
          </div>
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
      const hasFilters = Object.keys(filters).length > 0;
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
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading cards</div>;
  }

  if (!data || data.cards.length === 0) {
    return <div className="text-gray-400">No cards found</div>;
  }

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {data.cards.map((card) => (
          <CardCard key={card.id} card={card} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
