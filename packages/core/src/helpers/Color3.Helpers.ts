import { clamp, Color3, Vec3 } from '@threeify/math';

import { saturate } from './Math.Helpers';

// ====================
// ====================

function gammaCorrect(value: number): number {
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function inverseGammaCorrect(value: number): number {
  return value <= 0.0031308
    ? 12.92 * value
    : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

// Color conversion functions
export function color3sRgbToLinear(
  srgbColor: Color3,
  result = new Color3()
): Color3 {
  return result.set(
    gammaCorrect(srgbColor.r),
    gammaCorrect(srgbColor.g),
    gammaCorrect(srgbColor.b)
  );
}

export function color3LinearTosRgb(
  linearColor: Color3,
  result = new Color3()
): Color3 {
  return result.set(
    inverseGammaCorrect(linearColor.r),
    inverseGammaCorrect(linearColor.g),
    inverseGammaCorrect(linearColor.b)
  );
}

// ====================

// many possible luma functions, this one is from ITU BT.709, which is the standard for HDTV.
export function color3LinearToLuma(linearColor: Color3): number {
  return (
    0.2126 * linearColor.r + 0.7152 * linearColor.g + 0.0722 * linearColor.b
  );
}

// ====================

// vec3 rgbToNormal(const vec3 rgb) {
//  return 2.0 * rgb.xyz - 1.0;
// }
export function color3ToNormal(color: Color3, result = new Vec3()): Vec3 {
  return result.set(2 * color.r - 1, 2 * color.g - 1, 2 * color.b - 1);
}

//vec3 normalToRgb(const vec3 normal) {
//  return normalize(normal) * 0.5 + 0.5;
//}
export function normalToColor3(normal: Vec3, result = new Color3()): Color3 {
  return result.set(
    0.5 * (normal.x + 1),
    0.5 * (normal.y + 1),
    0.5 * (normal.z + 1)
  );
}

// ====================

export function color3Clamp(
  value: Color3,
  min: Color3,
  max: Color3,
  result = new Color3()
): Color3 {
  return result.set(
    clamp(value.r, min.r, max.r),
    clamp(value.g, min.g, max.g),
    clamp(value.b, min.b, max.b)
  );
}

export function color3Saturate(color: Color3, result = new Color3()): Color3 {
  return result.set(saturate(color.r), saturate(color.g), saturate(color.b));
}

// ====================

export function color3MaxComponent(color: Color3): number {
  return Math.max(color.r, color.g, color.b);
}
