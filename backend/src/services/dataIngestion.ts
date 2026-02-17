import { prisma } from '../utils/db';
import { logger } from '../utils/logger';
import { riotApiClient } from './riotApiClient';

interface RiotCardData {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  cost: number;
  type: string;
  attack?: number;
  health?: number;
  text?: string;
  flavorText?: string;
  artist?: string;
  set?: string;
  imageUrl?: string;
  imageHdUrl?: string;
  keywords?: string[];
}

export class DataIngestionService {
  /**
   * Normalize Riot API response to our database schema
   */
  private normalizeCard(riotCard: RiotCardData, setId: string): any {
    return {
      riotCardId: riotCard.id,
      name: riotCard.name,
      faction: riotCard.faction,
      rarity: riotCard.rarity,
      cost: riotCard.cost,
      type: riotCard.type,
      attack: riotCard.attack ?? null,
      health: riotCard.health ?? null,
      textRaw: riotCard.text ?? null,
      textParsed: riotCard.text ? this.parseCardText(riotCard.text) : null,
      flavorText: riotCard.flavorText ?? null,
      artist: riotCard.artist ?? null,
      setId,
      releaseDate: new Date(),
      imageSmallUrl: riotCard.imageUrl || '',
      imageHdUrl: riotCard.imageHdUrl || riotCard.imageUrl || '',
    };
  }

  /**
   * Parse card text to extract keywords and structured data
   */
  private parseCardText(text: string): Record<string, unknown> {
    // This is a placeholder - implement actual parsing logic based on Riftbound's text format
    return {
      raw: text,
      keywords: [],
    };
  }

  /**
   * Sync cards from Riot API
   */
  async syncCards(): Promise<void> {
    logger.info('Starting card sync from Riot API');

    try {
      // This is a placeholder - adjust based on actual Riot API endpoints
      // For now, we'll create a structure that can be filled in when API is available
      const riotCards: RiotCardData[] = await this.fetchCardsFromRiot();

      if (riotCards.length === 0) {
        logger.warn('No cards fetched from Riot API');
        return;
      }

      // Get or create sets
      const setMap = new Map<string, string>();
      for (const card of riotCards) {
        if (card.set) {
          if (!setMap.has(card.set)) {
            const set = await prisma.set.upsert({
              where: { name: card.set },
              update: {},
              create: {
                name: card.set,
                releaseDate: new Date(),
                patchVersion: await riotApiClient.checkApiVersion(),
              },
            });
            setMap.set(card.set, set.id);
          }
        }
      }

      // Process cards
      let created = 0;
      let updated = 0;
      let errors = 0;

      for (const riotCard of riotCards) {
        try {
          const setId = riotCard.set ? setMap.get(riotCard.set) : null;
          if (!setId) {
            logger.warn(`No set ID found for card ${riotCard.id}`);
            errors++;
            continue;
          }

          const cardData = this.normalizeCard(riotCard, setId);

          // Check if card exists
          const existingCard = await prisma.card.findUnique({
            where: { riotCardId: riotCard.id },
          });

          if (existingCard) {
            // Detect changes for patch tracking
            const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];

            Object.keys(cardData).forEach((key) => {
              if (key === 'riotCardId' || key === 'setId') return;
              const oldValue = (existingCard as any)[key];
              const newValue = cardData[key];

              if (oldValue !== newValue) {
                changes.push({
                  field: key,
                  oldValue,
                  newValue,
                });
              }
            });

            // Update card
            await prisma.card.update({
              where: { riotCardId: riotCard.id },
              data: cardData,
            });

            // Record patch changes
            if (changes.length > 0) {
              const patchVersion = await riotApiClient.checkApiVersion();
              await prisma.patchChange.createMany({
                data: changes.map((change) => ({
                  cardId: existingCard.id,
                  patchVersion,
                  fieldChanged: change.field,
                  oldValue: String(change.oldValue),
                  newValue: String(change.newValue),
                })),
              });
            }

            updated++;
          } else {
            // Create new card
            const card = await prisma.card.create({
              data: cardData,
            });

            // Create keyword associations
            if (riotCard.keywords && riotCard.keywords.length > 0) {
              for (const keywordName of riotCard.keywords) {
                const keyword = await prisma.keyword.upsert({
                  where: { name: keywordName },
                  update: {},
                  create: {
                    name: keywordName,
                    description: '', // Will be filled from API if available
                  },
                });

                await prisma.cardKeyword.upsert({
                  where: {
                    cardId_keywordId: {
                      cardId: card.id,
                      keywordId: keyword.id,
                    },
                  },
                  update: {},
                  create: {
                    cardId: card.id,
                    keywordId: keyword.id,
                  },
                });
              }
            }

            created++;
          }
        } catch (error) {
          logger.error(`Error processing card ${riotCard.id}`, { error, cardId: riotCard.id });
          errors++;
        }
      }

      logger.info('Card sync completed', {
        created,
        updated,
        errors,
        total: riotCards.length,
      });
    } catch (error) {
      logger.error('Card sync failed', { error });
      throw error;
    }
  }

  /**
   * Fetch cards from Riot API
   * Placeholder - implement based on actual API structure
   */
  private async fetchCardsFromRiot(): Promise<RiotCardData[]> {
    try {
      // This is a placeholder - adjust based on actual Riot API endpoints
      // For Riftbound, we'll need to check the actual API documentation
      logger.info('Fetching cards from Riot API...');
      
      // Placeholder return - replace with actual API call
      return [];
    } catch (error) {
      logger.error('Failed to fetch cards from Riot API', { error });
      throw error;
    }
  }

  /**
   * Incremental sync - only fetch changed cards
   */
  async incrementalSync(): Promise<void> {
    logger.info('Starting incremental sync');
    // Implement logic to detect and sync only changed cards
    await this.syncCards();
  }
}

export const dataIngestionService = new DataIngestionService();
