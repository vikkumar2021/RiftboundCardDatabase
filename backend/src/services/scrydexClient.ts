import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

/**
 * Fetches card data from the official Riftbound card gallery.
 * The site is Next.js and exposes a JSON data endpoint at:
 *   /_next/data/{buildId}/en-us/card-gallery.json
 *
 * No authentication is required.
 */

export interface RiftboundRawCard {
  id: string;
  name: string;
  publicCode: string;
  collectorNumber: string;
  orientation: string;
  set: {
    value: { id: string; label: string };
  };
  cardType: {
    type: Array<{ id: string; label: string }>;
    superType?: Array<{ id: string; label: string }>;
  };
  rarity: {
    value: { id: string; label: string };
  };
  domain?: {
    values: Array<{ id: string; label: string }>;
  };
  energy?: { value: { id: string; label: string } };
  might?: { value: { id: string; label: string } };
  power?: { value: { id: string; label: string } };
  tags?: { tags: string[] };
  text?: { richText: { body: string } };
  illustrator?: { values: Array<{ id: string; label: string }> };
  cardImage?: { url: string };
}

export class RiftboundGalleryClient {
  private client: AxiosInstance;
  private buildId: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://riftbound.leagueoflegends.com',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Detect the current Next.js build ID from the HTML page
   */
  async detectBuildId(): Promise<string> {
    logger.info('Detecting Next.js build ID...');
    const response = await this.client.get('/en-us/card-gallery/', {
      headers: { Accept: 'text/html' },
    });

    const html = response.data as string;
    const match = html.match(/\/_next\/static\/([^/]+)\/_buildManifest\.js/);

    if (!match) {
      throw new Error('Could not detect build ID from Riftbound card gallery page');
    }

    this.buildId = match[1];
    logger.info(`Detected build ID: ${this.buildId}`);
    return this.buildId;
  }

  /**
   * Fetch all card data in a single request (~1.7 MB JSON, 664 cards)
   */
  async fetchAllCards(): Promise<RiftboundRawCard[]> {
    if (!this.buildId) {
      await this.detectBuildId();
    }

    logger.info('Fetching card gallery JSON...');
    const url = `/_next/data/${this.buildId}/en-us/card-gallery.json`;
    const response = await this.client.get(url);
    const data = response.data;

    // Cards live at pageProps.page.blades[2].cards.items
    const blades = data?.pageProps?.page?.blades;
    if (!blades || !Array.isArray(blades)) {
      throw new Error('Unexpected page structure: missing blades array');
    }

    // Find the blade that contains the cards — typically index 2, but search to be safe
    let cards: RiftboundRawCard[] = [];
    for (const blade of blades) {
      if (blade?.cards?.items && Array.isArray(blade.cards.items)) {
        cards = blade.cards.items;
        break;
      }
    }

    if (cards.length === 0) {
      throw new Error('No cards found in gallery data');
    }

    logger.info(`Fetched ${cards.length} cards from gallery`);
    return cards;
  }
}

export const galleryClient = new RiftboundGalleryClient();
