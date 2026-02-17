import Image from 'next/image';
import { Card } from '@riftbound-atlas/shared';
import { ShareButton } from './ShareButton';

interface CardDetailProps {
  card: Card & {
    set?: { name: string; releaseDate: string };
    keywords?: Array<{ keyword: { name: string; description: string } }>;
  };
}

export function CardDetail({ card }: CardDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Card Image */}
        <div className="relative aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden">
          {card.imageHdUrl && (
            <Image
              src={card.imageHdUrl}
              alt={card.name}
              fill
              className="object-contain"
              priority
            />
          )}
        </div>

        {/* Card Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{card.name}</h1>

          <div className="space-y-4 mb-6">
            <div className="flex gap-4 text-lg">
              <span>
                <strong>Cost:</strong> {card.cost}
              </span>
              {card.attack !== null && (
                <span>
                  <strong>Attack:</strong> {card.attack}
                </span>
              )}
              {card.health !== null && (
                <span>
                  <strong>Health:</strong> {card.health}
                </span>
              )}
            </div>

            <div>
              <strong>Faction:</strong> {card.faction}
            </div>
            <div>
              <strong>Rarity:</strong> {card.rarity}
            </div>
            <div>
              <strong>Type:</strong> {card.type}
            </div>

            {card.set && (
              <div>
                <strong>Set:</strong> {card.set.name}
              </div>
            )}

            {card.textRaw && (
              <div>
                <strong>Text:</strong>
                <p className="mt-1 text-gray-300">{card.textRaw}</p>
              </div>
            )}

            {card.flavorText && (
              <div>
                <strong>Flavor:</strong>
                <p className="mt-1 italic text-gray-400">{card.flavorText}</p>
              </div>
            )}

            {card.artist && (
              <div>
                <strong>Artist:</strong> {card.artist}
              </div>
            )}

            {card.keywords && card.keywords.length > 0 && (
              <div>
                <strong>Keywords:</strong>
                <div className="mt-2 space-y-2">
                  {card.keywords.map((ck) => (
                    <div key={ck.keyword.name} className="bg-gray-800 p-3 rounded">
                      <div className="font-medium">{ck.keyword.name}</div>
                      {ck.keyword.description && (
                        <div className="text-sm text-gray-400 mt-1">
                          {ck.keyword.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share Button */}
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
