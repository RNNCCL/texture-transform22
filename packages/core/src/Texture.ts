import { Color3, Color4 } from '@threeify/math';

import { assert } from './helpers/assert';

export enum Channel {
  R = 0,
  G = 1,
  B = 2,
  A = 3
}

export type Texture = {
  width: number;
  height: number;
  channels: number;
  data: Float32Array;
};

export type Pixel = Color3 | Color4 | Float32Array | number[];

export function uint8ToFloatArray(
  uint8Array: Uint8Array,
  result = new Float32Array(uint8Array.length)
): Float32Array {
  for (let i = 0; i < uint8Array.length; i++) {
    result[i] = uint8Array[i] / 255;
  }
  return result;
}

export function floatToUint8Array(
  floatArray: Float32Array,
  result = new Uint8Array(floatArray.length)
): Uint8Array {
  for (let i = 0; i < floatArray.length; i++) {
    result[i] = clamp(floatArray[i] * 255, 0, 255); // is this correct?  Do I have to take rounding into account?
  }
  return result;
}

export function createTexture(
  width: number,
  height: number,
  channels: number,
  data = new Float32Array(width * height * channels)
): Texture {
  assert(width >= 1, 'width must be >= 1');
  assert(height >= 1, 'height must be >= 1');
  assert(channels >= 1 && channels <= 4, 'channels must be >= 1 && <= 4');
  assert(
    data.length === width * height * channels,
    'data must be the right length for width, height, and channels'
  );

  return { width, height, channels, data };
}

function getTexturePixelOffset(texture: Texture, x: number, y: number): number {
  assert(x >= 0 && x < texture.width, 'x must be >= 0 && < texture.width');
  assert(y >= 0 && y < texture.height, 'y must be >= 0 && < texture.height');
  return (y * texture.width + x) * texture.channels;
}

export function getTexturePixel(
  texture: Texture,
  x: number,
  y: number,
  result: Pixel
) {
  const index = getTexturePixelOffset(texture, x, y);

  if (result instanceof Float32Array || result instanceof Array) {
    assert(
      result.length === texture.channels,
      'result array must be the same length as the number of channels in the texture'
    );
    for (let i = 0; i < this.channels; i++) {
      result[i] = texture.data[index + i];
    }
  } else if (result instanceof Color3) {
    assert(
      texture.channels === 3,
      'texture must have 3 channels to get a Color3'
    );
    result.set(
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2]
    );
  } else if (result instanceof Color4) {
    assert(
      texture.channels === 4,
      'texture must have 4 channels to get a Color4'
    );
    result.set(
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2],
      texture.data[index + 3]
    );
  } else {
    throw new TypeError(
      `result must be a Float32Array, Color3, Color4, or number, but it is ${typeof result}`
    );
  }
}
export function setTexturePixel(
  texture: Texture,
  x: number,
  y: number,
  value: Pixel
): void {
  const index = getTexturePixelOffset(texture, x, y);
  if (value instanceof Float32Array || value instanceof Array) {
    assert(
      value.length === texture.channels,
      'value array must be the same length as the number of channels in the texture'
    );
    for (let i = 0; i < this.channels; i++) {
      texture.data[index + i] = value[i];
    }
  } else if (value instanceof Color3) {
    assert(
      texture.channels === 3,
      'texture must have 3 channels to set a Color3'
    );
    texture.data[index] = value.r;
    texture.data[index + 1] = value.g;
    texture.data[index + 2] = value.b;
  } else if (value instanceof Color4) {
    assert(
      texture.channels === 4,
      'texture must have 4 channels to set a Color4'
    );
    texture.data[index] = value.r;
    texture.data[index + 1] = value.g;
    texture.data[index + 2] = value.b;
    texture.data[index + 3] = value.a;
  } else {
    throw new TypeError(
      `value must be a Float32Array, Color3, Color4, or number, but it is ${typeof value}`
    );
  }
}

export function textureIterator(
  texture: Texture,
  iterator: (x: number, y: number) => void
): void {
  const result = new Float32Array(texture.channels);
  for (let y = 0; y < texture.height; y++) {
    for (let x = 0; x < texture.width; x++) {
      iterator(x, y);
    }
  }
}

export function copyTextureChannel(
  sourceTexture: Texture,
  sourceChannel: Channel,
  destinationTexture: Texture,
  destinationChannel: Channel
): Texture {
  assert(
    sourceChannel >= 0 && sourceChannel < sourceTexture.channels,
    'source channel must be >= 0 && < sourceTexture.channels'
  );
  assert(
    destinationChannel >= 0 && destinationChannel < destinationTexture.channels,
    'destination channel must be >= 0 && < destinationTexture.channels'
  );

  assert(
    sourceTexture.width === destinationTexture.width,
    'source and destination textures must have the same width'
  );
  assert(
    sourceTexture.height === destinationTexture.height,
    'source and destination textures must have the same height'
  );

  const sourcePixel = new Float32Array(sourceTexture.channels);
  const destinationPixel = new Float32Array(destinationTexture.channels);

  textureIterator(sourceTexture, (x, y) => {
    getTexturePixel(sourceTexture, x, y, sourcePixel);
    destinationPixel[destinationChannel] = sourcePixel[sourceChannel];
    setTexturePixel(destinationTexture, x, y, destinationPixel);
  });

  return destinationTexture;
}

export function extractTextureChannel(
  sourceTexture: Texture,
  sourceChannel: Channel
): Texture {
  assert(
    sourceChannel >= 0 && sourceChannel < sourceTexture.channels,
    'source channel must be >= 0 && < sourceTexture.channels'
  );

  const destinationTexture = createTexture(
    sourceTexture.width,
    sourceTexture.height,
    1
  );

  return copyTextureChannel(
    sourceTexture,
    sourceChannel,
    destinationTexture,
    0
  );
}

export function createTextureFromChannels(...channels: Texture[]): Texture {
  // TODO: ensure all channels are the same size.
  // TODO: ensure there are no more than 4 channels.
  // TODO: ensure that all channels only have a single channel

  const width = channels[0].width;
  const height = channels[0].height;
  const result = createTexture(width, height, channels.length);

  const pixel = new Float32Array(channels.length);
  textureIterator(result, (x, y) => {
    for (let i = 0; i < channels.length; i++) {
      getTexturePixel(channels[i], x, y, pixel);
    }
    setTexturePixel(result, x, y, pixel);
  });

  return result;
}
