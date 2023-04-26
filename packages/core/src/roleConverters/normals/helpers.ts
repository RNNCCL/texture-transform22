import { Color3, Vec3 } from "@threeify/math";

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
