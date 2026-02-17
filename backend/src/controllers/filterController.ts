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

export const getDomains = async (req: Request, res: Response): Promise<void> => {
  try {
    const domains = await getCachedOrFetch('filters:domains', async () => {
      const cards = await prisma.card.findMany({
        select: { domain: true },
        distinct: ['domain'],
      });
      return cards.map((c) => c.domain).sort();
    });
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains' });
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

export const getArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    const artists = await getCachedOrFetch('filters:artists', async () => {
      const cards = await prisma.card.findMany({
        select: { artist: true },
        distinct: ['artist'],
      });
      return cards.map((c) => c.artist).sort();
    });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};

export const getExpansions = async (req: Request, res: Response): Promise<void> => {
  try {
    const expansions = await getCachedOrFetch('filters:expansions', async () => {
      return prisma.expansion.findMany({
        orderBy: { name: 'asc' },
      });
    });
    res.json(expansions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expansions' });
  }
};
