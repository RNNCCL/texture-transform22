import { Color3, Vec3, vec3Normalize } from '@threeify/math';

import { assert } from '../../helpers/assert';
import {
  createTexture,
  getTexturePixel,
  setTexturePixel,
  Texture,
  textureIterator
} from '../../Texture';
import { normalToColor3 } from '../../helpers/Color3';

export function bumpToNormalMap(
  bumpTexture: Texture,
  strength = 1,
  normalTexture = createTexture(bumpTexture.width, bumpTexture.height, 3)
): Texture {
  assert(bumpTexture.channels === 1, 'bumpTexture.channels === 1');
  assert(normalTexture.channels === 3, 'normalTexture.channels === 3');

  const tempVec = new Vec3();
  const normal = new Vec3();
  const normalColor = new Color3();

  const upPixel = new Float32Array(1);
  const downPixel = new Float32Array(1);
  const leftPixel = new Float32Array(1);
  const rightPixel = new Float32Array(1);

  const normalPixel = new Float32Array(normalTexture.channels);

  textureIterator(bumpTexture, (x, y) => {
    // Calculate the height values of the surrounding pixels
    getTexturePixel(bumpTexture, y - 1, x, upPixel);
    getTexturePixel(bumpTexture, y + 1, x, downPixel);
    getTexturePixel(bumpTexture, y, x - 1, leftPixel);
    getTexturePixel(bumpTexture, y, x + 1, rightPixel);

    // Calculate the partial derivatives
    const dx = (rightPixel[0] - leftPixel[0]) * strength;
    const dy = (upPixel[0] - downPixel[0]) * strength;

    // Calculate the normal vector and normalize it
    normal.set(dx, dy, 1);
    vec3Normalize(normal, normal);
    normalToColor3(normal, normalColor);

    // Store the normal vector in the normal map data
    setTexturePixel(normalTexture, y, x, normalColor);
  });

  return normalTexture;
}
