import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { getRedisClient } from '../utils/redis';

const getCachedOrFetch = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> => {
  const redis = getRedisClient();
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const data = await fetchFn();
  await redis.setex(cacheKey, ttl, JSON.stringify(data));
  return data;
};

export const getFactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const factions = await getCachedOrFetch('filters:factions', async () => {
      const cards = await prisma.card.findMany({
        select: { faction: true },
        distinct: ['faction'],
      });
      return cards.map((c) => c.faction).sort();
    });
    res.json(factions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch factions' });
  }
};

export const getRarities = async (req: Request, res: Response): Promise<void> => {
  try {
    const rarities = await getCachedOrFetch('filters:rarities', async () => {
      const cards = await prisma.card.findMany({
        select: { rarity: true },
        distinct: ['rarity'],
      });
      return cards.map((c) => c.rarity).sort();
    });
    res.json(rarities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rarities' });
  }
};

export const getTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const types = await getCachedOrFetch('filters:types', async () => {
      const cards = await prisma.card.findMany({
        select: { type: true },
        distinct: ['type'],
      });
      return cards.map((c) => c.type).sort();
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch types' });
  }
};

export const getKeywords = async (req: Request, res: Response): Promise<void> => {
  try {
    const keywords = await getCachedOrFetch('filters:keywords', async () => {
      return prisma.keyword.findMany({
        orderBy: { name: 'asc' },
      });
    });
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
};

export const getSets = async (req: Request, res: Response): Promise<void> => {
  try {
    const sets = await getCachedOrFetch('filters:sets', async () => {
      return prisma.set.findMany({
        orderBy: { releaseDate: 'desc' },
      });
    });
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sets' });
  }
};
