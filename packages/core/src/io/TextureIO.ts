import path from 'node:path';

import sharp from 'sharp';

import { assert } from '../helpers/assert';
import {
  createTexture,
  floatToUint8Array,
  Texture,
  uint8ToFloatArray
} from '../Texture';

export async function readTexture(inputPath: string) {
  // Read the image
  const image = sharp(inputPath);

  // Get image metadata
  const metadata = await image.metadata();

  // Get raw pixel data
  const rawPixelData = await image.raw().toBuffer();
  const floatPixelData = uint8ToFloatArray(rawPixelData as Uint8Array);

  return createTexture(
    metadata.width,
    metadata.height,
    metadata.channels,
    floatPixelData
  );
}

export async function writeTexture(
  texture: Texture,
  outputPath: string,
  quality = 100
) {
  assert(quality >= 0 && quality <= 100, 'quality must be >= 0 && <= 100');

  const { width, height, channels, data } = texture;

  const rawPixelData = floatToUint8Array(data);

  let image = sharp(rawPixelData, {
    raw: { width, height, channels }
  });

  const extension = path.extname(outputPath);
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      image = image.jpeg({ quality });
      break;
    case '.webp':
      image = image.webp({ quality });
      break;
  }

  await image.toFile(outputPath);
}
