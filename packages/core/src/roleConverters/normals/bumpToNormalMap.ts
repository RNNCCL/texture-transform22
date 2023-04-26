import { vec3Normalize, Vec3, Color3 } from "@threeify/math";
import {
  Texture,
  createTexture,
  getTexturePixel,
  setTexturePixel,
  textureIterator,
} from "../../Texture";
import { normalToColor3 } from "./helpers";

export function bumpToNormalMap(
  bumpTexture: Texture,
  strength = 1.0,
  normalTexture = createTexture(bumpTexture.width, bumpTexture.height, 3)
): Texture {
  const tempVec = new Vec3();
  const tempColor = new Color3();

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
    const normal = vec3Normalize(tempVec.set(dx, dy, 1));
    const color = normalToColor3(normal, tempColor);
    normalPixel[0] = color.r;
    normalPixel[1] = color.g;
    normalPixel[2] = color.b;
    normalPixel[3] = 1;

    // Store the normal vector in the normal map data
    setTexturePixel(normalTexture, y, x, normalPixel);
  });

  return normalTexture;
}
