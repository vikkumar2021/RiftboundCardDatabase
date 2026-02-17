import sharp from 'sharp';
import { logger } from './logger';

export interface ImageSizes {
  thumbnail: { width: number; height: number };
  standard: { width: number; height: number };
  hd: { width: number; height: number };
}

export const IMAGE_SIZES: ImageSizes = {
  thumbnail: { width: 300, height: 450 },
  standard: { width: 800, height: 1200 },
  hd: { width: 1600, height: 2400 },
};

/**
 * Process and optimize image from URL
 * Returns optimized image buffer in WebP format
 */
export async function processImage(
  imageUrl: string,
  width: number,
  height: number,
  format: 'webp' | 'avif' = 'webp'
): Promise<Buffer> {
  try {
    // Fetch image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Process with sharp
    const processed = await sharp(imageBuffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, {
        quality: format === 'webp' ? 85 : 80,
      })
      .toBuffer();

    return processed;
  } catch (error) {
    logger.error('Image processing failed', { error, imageUrl, width, height });
    throw error;
  }
}

/**
 * Generate multiple sizes of an image
 */
export async function generateImageVariants(
  imageUrl: string
): Promise<{
  thumbnail: Buffer;
  standard: Buffer;
  hd: Buffer;
}> {
  const [thumbnail, standard, hd] = await Promise.all([
    processImage(imageUrl, IMAGE_SIZES.thumbnail.width, IMAGE_SIZES.thumbnail.height),
    processImage(imageUrl, IMAGE_SIZES.standard.width, IMAGE_SIZES.standard.height),
    processImage(imageUrl, IMAGE_SIZES.hd.width, IMAGE_SIZES.hd.height),
  ]);

  return { thumbnail, standard, hd };
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
