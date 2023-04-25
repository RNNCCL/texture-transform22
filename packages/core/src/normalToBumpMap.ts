// from ChatGPT 4
// TODO: ensure it is correct
export function normalToBumpMap(normalData, width, height, strength) {
    const bumpData = new Uint8Array(width * height);
    strength = strength || 1;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
  
        // Extract the normal vector from the normal map data
        const normal = new THREE.Vector3(
          (normalData[index] - 128) / 127,
          (normalData[index + 1] - 128) / 127,
          normalData[index + 2] / 255
        );
  
        // Calculate the height value based on the normal vector
        const heightValue = (normal.x + normal.y) * 0.5 * strength;
  
        // Store the height value in the bump map data
        bumpData[y * width + x] = Math.round(heightValue * 255);
      }
    }
  
    return bumpData;
  }
  