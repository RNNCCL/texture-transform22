import { bumpToNormalMap } from "./roleConverters/normals/bumpToNormalMap";
import { normalToBumpMap } from "./roleConverters/normals/normalToBumpMap";

export enum Role {
    Normal,
    Bump,
    Height,
    Roughness,
    Metallic,
    Occlusion,
    Emissive,
    Diffuse,
    Specular,
    Glossiness,
    Displacement,
    F0,
    IOR
}

export const availableRoleConversions = [
    { from: Role.Bump, to: Role.Normal, fn: bumpToNormalMap },
    { from: Role.Normal, to: Role.Bump, fn: normalToBumpMap },
    { from: Role.Glossiness, to: Role.Roughness, fn: glossinessToRoughnessMap },
    { from: Role.Roughness, to: Role.Glossiness, fn: roughnessToGlossinessMap },
];

export async function convertRole(input: string, from: string, output: string, to: string, quality: number ) {
    
}