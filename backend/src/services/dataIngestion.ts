import { prisma } from '../utils/db';
import { logger } from '../utils/logger';
import { galleryClient, RiftboundRawCard } from './scrydexClient';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export class DataIngestionService {
  /**
   * Normalize a raw Riftbound gallery card into our DB shape
   */
  private normalizeCard(raw: RiftboundRawCard) {
    const domains = raw.domain?.values?.map((d) => d.label) || [];
    const types = raw.cardType?.type?.map((t) => t.label) || [];
    const superTypes = raw.cardType?.superType?.map((s) => s.label) || [];
    const artists = raw.illustrator?.values?.map((a) => a.label) || [];
    const tags = raw.tags?.tags || [];
    const rulesHtml = raw.text?.richText?.body || null;
    const rulesText = rulesHtml ? stripHtml(rulesHtml) : null;

    const setId = raw.set?.value?.id || 'UNKNOWN';
    const setName = raw.set?.value?.label || 'Unknown';

    return {
      card: {
        riotId: raw.id,
        publicCode: raw.publicCode || `${setId}-${raw.collectorNumber}`,
        name: raw.name,
        collectorNumber: raw.collectorNumber || '',
        domain: domains.join(', ') || 'Colorless',
        type: types[0] || 'Unknown',
        superTypes: superTypes,
        rarity: raw.rarity?.value?.label || 'Common',
        energy: raw.energy?.value?.id || null,
        might: raw.might?.value?.id || null,
        power: raw.power?.value?.id || null,
        tags: tags,
        rulesHtml: rulesHtml,
        rulesText: rulesText,
        artist: artists.join(', ') || null,
        imageUrl: raw.cardImage?.url || '',
        orientation: raw.orientation || 'portrait',
        setId,
      },
      setId,
      setName,
    };
  }

  /**
   * Full sync: scrape the Riftbound card gallery and upsert everything
   */
  async syncAll(): Promise<{ created: number; updated: number; errors: number; total: number }> {
    logger.info('Starting full card sync from Riftbound card gallery');

    const rawCards = await galleryClient.fetchAllCards();
    logger.info(`Fetched ${rawCards.length} raw cards`);

    // Collect unique sets
    const sets = new Map<string, string>();
    for (const raw of rawCards) {
      const setId = raw.set?.value?.id;
      const setName = raw.set?.value?.label;
      if (setId && setName && !sets.has(setId)) {
        sets.set(setId, setName);
      }
    }

    // Upsert expansions
    for (const [id, name] of sets) {
      await prisma.expansion.upsert({
        where: { id },
        update: { name },
        create: { id, name },
      });
      logger.info(`Synced expansion: ${name} (${id})`);
    }

    // Process cards
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const raw of rawCards) {
      try {
        const { card } = this.normalizeCard(raw);

        if (!card.setId || card.setId === 'UNKNOWN') {
          logger.warn(`Skipping card with no set: ${raw.name}`);
          errors++;
          continue;
        }

        const existing = await prisma.card.findUnique({
          where: { riotId: card.riotId },
        });

        if (existing) {
          // Track changes
          const trackedFields = ['name', 'domain', 'type', 'rarity', 'rulesText', 'artist'] as const;
          for (const field of trackedFields) {
            const oldVal = (existing as any)[field];
            const newVal = card[field];
            if (oldVal !== newVal && oldVal !== undefined && newVal !== undefined) {
              await prisma.patchChange.create({
                data: {
                  cardId: existing.id,
                  fieldChanged: field,
                  oldValue: String(oldVal ?? ''),
                  newValue: String(newVal ?? ''),
                },
              });
            }
          }

          await prisma.card.update({
            where: { riotId: card.riotId },
            data: card,
          });
          updated++;
        } else {
          await prisma.card.create({ data: card });
          created++;
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Error processing card ${raw.name}: ${msg}`);
        errors++;
      }
    }

    const result = { created, updated, errors, total: rawCards.length };
    logger.info('Full sync completed', result);
    return result;
  }
}

export const dataIngestionService = new DataIngestionService();
