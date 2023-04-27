// first in list is the default name, and it must be unique.

export enum TextureName {
  Alpha = 'alpha',

  Diffuse = 'diffuse',
  Specular = 'specular',
  Glossiness = 'glossiness',

  Base = 'base',
  Metallic = 'metallic',
  Roughness = 'roughness',

  Occlusion = 'occlusion',
  Emissive = 'emissive',

  Bump = 'bump',
  Normal = 'normal',
  Displacement = 'displacement',

  Ior = 'ior',
  F0 = 'f0',
  Reflection = 'reflection',

  Sheen = 'sheen',
  SheenColor = 'sheenColor',
  SheenRoughness = 'sheenRoughness',

  Clearcoat = 'clearcoat',
  ClearcoatRoughness = 'clearcoatRoughness',
  ClearcoatNormal = 'clearcoatNormal',
  ClearcoatTint = 'clearcoatTint',

  AnisotropyDirection = 'anisotropyDirection',
  AnisotropyRotation = 'anisotropyRotation',

  Transmission = 'transmission',
  TransmissionRoughness = 'transmissionRoughness',

  Thickness = 'thickness',

  Subsurface = 'subsurface'
}

// need to eventually be able to say which channel the data should be in.
export const TextureNames: Record<TextureName, string[]> = {
  [TextureName.Alpha]: ['alpha', 'opacity'],

  [TextureName.Diffuse]: ['diffuse', 'diff'],
  [TextureName.Specular]: ['specular', 'spec'],
  [TextureName.Glossiness]: ['glossiness', 'gloss'],

  [TextureName.Base]: ['baseColor', 'diffuse', 'albedo'],
  [TextureName.Metallic]: ['metallic', 'metalness', 'metal'],
  [TextureName.Roughness]: ['roughness', 'rough'],

  [TextureName.Occlusion]: ['occlusion', 'ao'],
  [TextureName.Emissive]: ['emissive'],

  [TextureName.Bump]: ['bump', 'height'],
  [TextureName.Normal]: ['normal'],
  [TextureName.Displacement]: ['displacement', 'height'],

  [TextureName.Reflection]: ['reflection', 'reflect'],
  [TextureName.Ior]: ['ior'],
  [TextureName.F0]: ['f0'],

  [TextureName.Sheen]: ['sheen'],
  [TextureName.SheenColor]: ['sheenColor'],
  [TextureName.SheenRoughness]: ['sheenRoughness'],

  [TextureName.Clearcoat]: ['clearcoat'],
  [TextureName.ClearcoatNormal]: ['clearcoatNormal'],
  [TextureName.ClearcoatRoughness]: ['clearcoatRoughness'],
  [TextureName.ClearcoatTint]: ['clearcoatTint'],

  [TextureName.AnisotropyDirection]: ['anisotropy', 'aniso'],
  [TextureName.AnisotropyRotation]: ['anisotropyRotation'],

  [TextureName.Transmission]: ['transmission'],
  [TextureName.TransmissionRoughness]: ['transmissionRoughness'],

  [TextureName.Thickness]: ['thickness'],

  [TextureName.Subsurface]: ['subsurface']
};
