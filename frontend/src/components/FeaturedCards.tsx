'use client';

import { useQuery } from '@tanstack/react-query';
import { cardApi } from '@/lib/api';
import Link from 'next/link';

export function FeaturedCards() {
  const { data } = useQuery({
    queryKey: ['featuredCards'],
    queryFn: () => cardApi.getCards(1, 8),
  });

  if (!data || data.cards.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Browse Cards</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {data.cards.map((card: any) => (
          <Link key={card.id} href={`/cards/${card.scrydexId}`}>
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-all group">
              <div className="relative aspect-[2/3] bg-gray-800">
                {card.imageSmall ? (
                  <img
                    src={card.imageSmall}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-2">
                <h3 className="font-medium text-xs truncate">{card.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/cards"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          View All Cards
        </Link>
      </div>
    </div>
  );
}
