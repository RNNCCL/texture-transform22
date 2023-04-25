export enum Channel {
  R = 0,
  G = 1,
  B = 2,
  A = 3,
}

export type Texture = {
  width: number;
  height: number;
  channels: number;
  data: Uint8Array;
};

export function createTexture(
  width: number,
  height: number,
  channels: number,
  data = new Uint8Array(width * height * channels)
): Texture {
  // TODO: ensure width and height are >= 1
  // TODO: ensure channels is >= 1 && <= 4
  // TODO: ensure data is the right length for width, height, and channels
  return { width, height, channels, data };
}

function getTexturePixelOffset(texture: Texture, x: number, y: number): number {
  return (y * texture.width + x) * texture.channels;
}

export function getTexturePixel(
  texture: Texture,
  x: number,
  y: number,
  result = new Uint8Array(this.channels)
): Uint8Array {
  const index = getTexturePixelOffset(texture, x, y);
  for (let i = 0; i < this.channels; i++) {
    result[i] = texture.data[index + i];
  }
  return result;
}
export function setTexturePixel(
  texture: Texture,
  x: number,
  y: number,
  value: Uint8Array
): void {
  const index = getTexturePixelOffset(texture, x, y);
  for (let i = 0; i < this.channels; i++) {
    texture.data[index + i] = value[i];
  }
}

export function textureIterator(
  texture: Texture,
  iterator: (x: number, y: number) => void
): void {
  const result = new Uint8Array(texture.channels);
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
  // TODO: ensure source channel is within range.
  // TODO: ensure dest channel is within range
  // TODO: ensure source and dest textures are the same size.

  const sourcePixel = new Uint8Array(sourceTexture.channels);
  const destinationPixel = new Uint8Array(destinationTexture.channels);

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
  // TODO: ensure source channel is within range.
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

  const pixel = new Uint8Array(channels.length);
  textureIterator(result, (x, y) => {
    for (let i = 0; i < channels.length; i++) {
      getTexturePixel(channels[i], x, y, pixel);
    }
    setTexturePixel(result, x, y, pixel);
  });

  return result;
}