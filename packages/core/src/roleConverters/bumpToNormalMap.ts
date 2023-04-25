// from ChatGPT 4
// TODO: ensure it is correct
function bumpToNormalMap(bumpData, width, height, strength) {
    const normalData = new Uint8Array(width * height * 4);
    strength = strength || 1;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
  
        // Calculate the height values of the surrounding pixels
        const up = bumpData[((y - 1 + height) % height) * width + x];
        const down = bumpData[((y + 1) % height) * width + x];
        const left = bumpData[y * width + ((x - 1 + width) % width)];
        const right = bumpData[y * width + ((x + 1) % width)];
  
        // Calculate the partial derivatives
        const dx = (right - left) * strength;
        const dy = (up - down) * strength;
  
        // Calculate the normal vector and normalize it
        const normal = new THREE.Vector3(dx, dy, 1).normalize();
  
        // Store the normal vector in the normal map data
        normalData[index] = normal.x * 127 + 128;
        normalData[index + 1] = normal.y * 127 + 128;
        normalData[index + 2] = normal.z * 255;
        normalData[index + 3] = 255;
      }
    }
  
    return normalData;
  }
  