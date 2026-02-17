import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { getRedisClient } from '../utils/redis';
import { CardSearchFilters } from '@riftbound-atlas/shared';

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const skip = (page - 1) * pageSize;

    const redis = getRedisClient();
    const cacheKey = `cards:page:${page}:size:${pageSize}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        skip,
        take: pageSize,
        orderBy: { expansionSortOrder: 'asc' },
        include: { expansion: true },
      }),
      prisma.card.count(),
    ]);

    const result = { cards, total, page, pageSize };
    await redis.setex(cacheKey, 300, JSON.stringify(result));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

export const getCardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const redis = getRedisClient();
    const cacheKey = `card:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    // Try UUID first, then scrydexId
    let card = await prisma.card.findUnique({
      where: { id },
      include: { expansion: true },
    });

    if (!card) {
      card = await prisma.card.findUnique({
        where: { scrydexId: id },
        include: { expansion: true },
      });
    }

    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    await redis.setex(cacheKey, 600, JSON.stringify(card));
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

export const searchCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: CardSearchFilters = {
      domains: req.query.domains ? (req.query.domains as string).split(',') : undefined,
      rarities: req.query.rarities ? (req.query.rarities as string).split(',') : undefined,
      types: req.query.types ? (req.query.types as string).split(',') : undefined,
      expansions: req.query.expansions ? (req.query.expansions as string).split(',') : undefined,
      textSearch: req.query.q as string | undefined,
    };

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters.domains?.length) {
      where.domain = { in: filters.domains };
    }
    if (filters.rarities?.length) {
      where.rarity = { in: filters.rarities };
    }
    if (filters.types?.length) {
      where.type = { in: filters.types };
    }
    if (filters.expansions?.length) {
      where.expansionId = { in: filters.expansions };
    }
    if (filters.textSearch) {
      where.OR = [
        { name: { contains: filters.textSearch, mode: 'insensitive' } },
        { artist: { contains: filters.textSearch, mode: 'insensitive' } },
      ];
    }

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { expansionSortOrder: 'asc' },
        include: { expansion: true },
      }),
      prisma.card.count({ where }),
    ]);

    res.json({ cards, total, page, pageSize, filters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search cards' });
  }
};
