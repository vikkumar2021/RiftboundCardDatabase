'use client';

import { ShareButton } from './ShareButton';

interface CardDetailProps {
  card: {
    id: string;
    riotId: string;
    publicCode: string;
    name: string;
    collectorNumber: string;
    domain: string;
    type: string;
    superTypes: string[];
    rarity: string;
    energy: string | null;
    might: string | null;
    power: string | null;
    tags: string[];
    rulesHtml: string | null;
    rulesText: string | null;
    artist: string | null;
    imageUrl: string;
    orientation: string;
    set?: { id: string; name: string };
  };
}

const rarityColors: Record<string, string> = {
  Common: 'bg-gray-600',
  Uncommon: 'bg-green-600',
  Rare: 'bg-blue-600',
  Epic: 'bg-purple-600',
  Showcase: 'bg-yellow-600',
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
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.name} className="w-full h-auto" />
            ) : (
              <div className="aspect-[2/3] flex items-center justify-center text-gray-600">
                No Image Available
              </div>
            )}
          </div>
          {card.artist && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              Illustrated by <span className="text-gray-300">{card.artist}</span>
            </p>
          )}
        </div>

        {/* Card Info */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{card.name}</h1>

          {/* Badges */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={`px-2 py-1 rounded text-xs font-medium ${rarityColors[card.rarity] || 'bg-gray-600'}`}>
              {card.rarity}
            </span>
            <span className={`text-lg font-medium ${domainColors[card.domain] || 'text-gray-400'}`}>
              {card.domain}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">{card.type}</span>
            {card.superTypes?.length > 0 && (
              <>
                <span className="text-gray-500">·</span>
                <span className="text-yellow-400">{card.superTypes.join(', ')}</span>
              </>
            )}
          </div>

          {/* Stats */}
          {(card.energy || card.might || card.power) && (
            <div className="flex gap-4 mb-6">
              {card.energy && (
                <div className="bg-blue-900/40 border border-blue-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xs text-blue-400 uppercase">Energy</p>
                  <p className="text-2xl font-bold">{card.energy}</p>
                </div>
              )}
              {card.might && (
                <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xs text-red-400 uppercase">Might</p>
                  <p className="text-2xl font-bold">{card.might}</p>
                </div>
              )}
              {card.power && (
                <div className="bg-green-900/40 border border-green-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xs text-green-400 uppercase">Power</p>
                  <p className="text-2xl font-bold">{card.power}</p>
                </div>
              )}
            </div>
          )}

          {/* Rules / Abilities */}
          {card.rulesHtml && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Ability
              </h3>
              <div
                className="text-gray-200 leading-relaxed prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: card.rulesHtml }}
              />
            </div>
          )}

          {/* Tags */}
          {card.tags?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex gap-2 flex-wrap">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Set</p>
              <p className="font-medium">{card.set?.name || card.setId}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Number</p>
              <p className="font-medium">{card.collectorNumber}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Code</p>
              <p className="font-medium font-mono text-sm">{card.publicCode}</p>
            </div>
            {card.artist && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Artist</p>
                <p className="font-medium">{card.artist}</p>
              </div>
            )}
          </div>

          <ShareButton />
        </div>
      </div>
    </div>
  );
}
