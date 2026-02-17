'use client';

import { useQuery } from '@tanstack/react-query';
import { cardApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export function FeaturedCards() {
  const { data } = useQuery({
    queryKey: ['featuredCards'],
    queryFn: () => cardApi.getCards(1, 6),
  });

  if (!data || data.cards.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recent Cards</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {data.cards.map((card) => (
          <Link key={card.id} href={`/cards/${card.id}`}>
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
              <div className="p-2">
                <h3 className="font-medium text-sm truncate">{card.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
