import { Texture, createTexture } from "../../Texture";

export function normalToBumpMap(
  normalTexture: Texture,
  strength = 1,
  heightTexture = createTexture(normalTexture.width, normalTexture.height, 1)
): Texture {
  // this requires a poisson solver or similar to integrate in the values to the height map.
  throw new Error("Not implemented");
}
