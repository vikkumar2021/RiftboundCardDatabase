import { prisma } from '../utils/db';
import { logger } from '../utils/logger';
import { scrydexClient } from './scrydexClient';
import { ScrydexCardResponse, ScrydexExpansionResponse } from '@riftbound-atlas/shared';

export class DataIngestionService {
  /**
   * Normalize a Scrydex API card into our DB record shape
   */
  private normalizeCard(card: ScrydexCardResponse) {
    const frontImage = card.images.find((img) => img.type === 'front') || card.images[0];

    return {
      scrydexId: card.id,
      name: card.name,
      number: card.number,
      printedNumber: card.printed_number,
      domain: card.domain,
      type: card.type,
      artist: card.artist || 'Unknown',
      rarity: card.rarity,
      rules: card.rules || [],
      imageSmall: frontImage?.small || '',
      imageMedium: frontImage?.medium || '',
      imageLarge: frontImage?.large || '',
      expansionId: card.expansion.id,
      language: card.language,
      languageCode: card.language_code,
      expansionSortOrder: card.expansion_sort_order,
      variants: card.variants || [],
    };
  }

  /**
   * Normalize a Scrydex expansion into our DB record shape
   */
  private normalizeExpansion(exp: ScrydexExpansionResponse) {
    return {
      id: exp.id,
      name: exp.name,
      type: exp.type,
      code: exp.code,
      total: exp.total,
      printedTotal: exp.printed_total,
      releaseDate: exp.release_date,
      logo: exp.logo || '',
      language: exp.language,
      languageCode: exp.language_code,
    };
  }

  /**
   * Full sync: fetch all expansions and all their cards from Scrydex
   */
  async syncAll(): Promise<void> {
    logger.info('Starting full card sync from Scrydex API');

    try {
      // 1. Sync expansions
      const expansionsRes = await scrydexClient.getExpansions();
      const expansions = expansionsRes.data;
      logger.info(`Found ${expansions.length} expansions`);

      for (const exp of expansions) {
        const expData = this.normalizeExpansion(exp);
        await prisma.expansion.upsert({
          where: { id: expData.id },
          update: expData,
          create: expData,
        });
        logger.info(`Synced expansion: ${expData.name} (${expData.id})`);
      }

      // 2. Sync cards for each expansion
      let totalCreated = 0;
      let totalUpdated = 0;
      let totalErrors = 0;

      for (const exp of expansions) {
        logger.info(`Fetching all cards for expansion: ${exp.name} (${exp.id})`);
        const cards = await scrydexClient.getAllExpansionCards(exp.id);
        logger.info(`Processing ${cards.length} cards from ${exp.name}`);

        for (const card of cards) {
          try {
            const cardData = this.normalizeCard(card);

            const existing = await prisma.card.findUnique({
              where: { scrydexId: cardData.scrydexId },
            });

            if (existing) {
              // Detect changes for patch tracking
              const fieldsToTrack = ['name', 'domain', 'type', 'rarity', 'rules', 'artist'] as const;
              for (const field of fieldsToTrack) {
                const oldVal = JSON.stringify((existing as any)[field]);
                const newVal = JSON.stringify(cardData[field]);
                if (oldVal !== newVal) {
                  await prisma.patchChange.create({
                    data: {
                      cardId: existing.id,
                      fieldChanged: field,
                      oldValue: oldVal,
                      newValue: newVal,
                    },
                  });
                }
              }

              await prisma.card.update({
                where: { scrydexId: cardData.scrydexId },
                data: cardData,
              });
              totalUpdated++;
            } else {
              await prisma.card.create({ data: cardData });
              totalCreated++;
            }
          } catch (error) {
            logger.error(`Error processing card ${card.id}`, { error });
            totalErrors++;
          }
        }
      }

      logger.info('Full sync completed', {
        created: totalCreated,
        updated: totalUpdated,
        errors: totalErrors,
      });
    } catch (error) {
      logger.error('Full sync failed', { error });
      throw error;
    }
  }

  /**
   * Quick sync: only re-fetch cards, skip if counts match
   */
  async incrementalSync(): Promise<void> {
    logger.info('Starting incremental sync');
    await this.syncAll(); // For now, just do a full sync
  }
}

export const dataIngestionService = new DataIngestionService();
