'use client';

import { ShareButton } from './ShareButton';

interface CardDetailProps {
  card: {
    id: string;
    scrydexId: string;
    name: string;
    number: string;
    printedNumber: string;
    domain: string;
    type: string;
    artist: string;
    rarity: string;
    rules: string[];
    imageSmall: string;
    imageMedium: string;
    imageLarge: string;
    expansionSortOrder: number;
    variants: Array<{
      name: string;
      prices: Array<{
        condition: string;
        low: number;
        market: number;
        currency: string;
      }>;
    }>;
    expansion?: {
      id: string;
      name: string;
      releaseDate: string;
      logo: string;
    };
  };
}

const rarityColors: Record<string, string> = {
  Common: 'bg-gray-600',
  Uncommon: 'bg-green-600',
  Rare: 'bg-blue-600',
  Epic: 'bg-purple-600',
};

const domainColors: Record<string, string> = {
  Fire: 'text-red-400',
  Water: 'text-blue-400',
  Earth: 'text-amber-400',
  Air: 'text-cyan-400',
  Shadow: 'text-purple-400',
  Light: 'text-yellow-300',
  Colorless: 'text-gray-400',
};

export function CardDetail({ card }: CardDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-gray-300">Home</a>
        <span className="mx-2">/</span>
        <a href="/cards" className="hover:text-gray-300">Cards</a>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{card.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Card Image */}
        <div>
          <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            {card.imageLarge ? (
              <img
                src={card.imageLarge}
                alt={card.name}
                className="w-full h-auto"
              />
            ) : card.imageMedium ? (
              <img
                src={card.imageMedium}
                alt={card.name}
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-[2/3] flex items-center justify-center text-gray-600">
                No Image Available
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Illustrated by <span className="text-gray-300">{card.artist}</span>
          </p>
        </div>

        {/* Card Info */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-4xl font-bold">{card.name}</h1>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className={`px-2 py-1 rounded text-xs font-medium ${rarityColors[card.rarity] || 'bg-gray-600'}`}>
              {card.rarity}
            </span>
            <span className={`text-lg font-medium ${domainColors[card.domain] || 'text-gray-400'}`}>
              {card.domain}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">{card.type}</span>
          </div>

          {/* Rules / Effects */}
          {card.rules && card.rules.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Rules</h3>
              <div className="space-y-2">
                {card.rules.map((rule, i) => (
                  <p key={i} className="text-gray-200 leading-relaxed">{rule}</p>
                ))}
              </div>
            </div>
          )}

          {/* Card Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Set</p>
              <p className="font-medium">{card.expansion?.name || 'Unknown'}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Number</p>
              <p className="font-medium">{card.printedNumber}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Artist</p>
              <p className="font-medium">{card.artist}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Card ID</p>
              <p className="font-medium font-mono text-sm">{card.scrydexId}</p>
            </div>
          </div>

          {/* Pricing */}
          {card.variants && card.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Market Prices</h3>
              <div className="grid grid-cols-2 gap-3">
                {card.variants.map((variant) => {
                  const price = variant.prices?.[0];
                  return (
                    <div key={variant.name} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 capitalize">{variant.name}</p>
                      {price ? (
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold text-green-400">
                            ${price.market?.toFixed(2) || '—'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Low: ${price.low?.toFixed(2) || '—'}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-1">No price data</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ShareButton />
        </div>
      </div>
    </div>
  );
}
