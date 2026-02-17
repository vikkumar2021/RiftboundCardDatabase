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
        orderBy: { name: 'asc' },
        include: {
          set: true,
          keywords: {
            include: {
              keyword: true,
            },
          },
        },
      }),
      prisma.card.count(),
    ]);

    const result = {
      cards,
      total,
      page,
      pageSize,
    };

    await redis.setex(cacheKey, 300, JSON.stringify(result)); // Cache for 5 minutes

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

    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        set: true,
        keywords: {
          include: {
            keyword: true,
          },
        },
      },
    });

    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    await redis.setex(cacheKey, 600, JSON.stringify(card)); // Cache for 10 minutes

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

export const searchCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: CardSearchFilters = {
      costMin: req.query.costMin ? parseInt(req.query.costMin as string) : undefined,
      costMax: req.query.costMax ? parseInt(req.query.costMax as string) : undefined,
      factions: req.query.factions ? (req.query.factions as string).split(',') : undefined,
      rarities: req.query.rarities ? (req.query.rarities as string).split(',') : undefined,
      types: req.query.types ? (req.query.types as string).split(',') : undefined,
      keywords: req.query.keywords ? (req.query.keywords as string).split(',') : undefined,
      sets: req.query.sets ? (req.query.sets as string).split(',') : undefined,
      textSearch: req.query.q as string | undefined,
    };

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (filters.costMin !== undefined || filters.costMax !== undefined) {
      where.cost = {};
      if (filters.costMin !== undefined) where.cost.gte = filters.costMin;
      if (filters.costMax !== undefined) where.cost.lte = filters.costMax;
    }

    if (filters.factions && filters.factions.length > 0) {
      where.faction = { in: filters.factions };
    }

    if (filters.rarities && filters.rarities.length > 0) {
      where.rarity = { in: filters.rarities };
    }

    if (filters.types && filters.types.length > 0) {
      where.type = { in: filters.types };
    }

    if (filters.sets && filters.sets.length > 0) {
      where.setId = { in: filters.sets };
    }

    if (filters.keywords && filters.keywords.length > 0) {
      where.keywords = {
        some: {
          keywordId: { in: filters.keywords },
        },
      };
    }

    if (filters.textSearch) {
      where.OR = [
        { name: { contains: filters.textSearch, mode: 'insensitive' } },
        { textRaw: { contains: filters.textSearch, mode: 'insensitive' } },
        { flavorText: { contains: filters.textSearch, mode: 'insensitive' } },
      ];
    }

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          set: true,
          keywords: {
            include: {
              keyword: true,
            },
          },
        },
      }),
      prisma.card.count({ where }),
    ]);

    res.json({
      cards,
      total,
      page,
      pageSize,
      filters,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search cards' });
  }
};
