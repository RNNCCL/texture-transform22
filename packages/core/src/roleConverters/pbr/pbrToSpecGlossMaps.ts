import { Color3, color3Lerp } from "@threeify/math";
import { Texture, createTexture, getTexturePixel, textureIterator } from "../../Texture";

const dielectricSpecular = new Color3(0.04, 0.04, 0.04);
const epsilon = 1e-6;

// from: https://kcoley.github.io/glTF/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness/examples/convert-between-workflows/


// Assume that all modulators are default values, so we can deal just in textures.

// TODO: Add support for specular texture as well.

export function pbrToSpecularGlossiness(
    baseTexture: Texture,
    metallicTexture: Texture,
    roughnessTexture: Texture,
    diffuseTexture= createTexture( baseTexture.width, baseTexture.height, 3),
    specularTexture= createTexture( baseTexture.width, baseTexture.height, 3),
    glossinessTexture= createTexture( baseTexture.width, baseTexture.height, 1)
): { specularTexture: Texture, diffuseTexture: Texture, glossinessTexture: Texture } {
    // TODO: confirm all 3 input textures are the same size.
    // TODO: confirm base texture is 3 channel, the others are 1 channel.

    const basePixel = new Float32Array(baseTexture.channels);
    const metallicPixel = new Float32Array(metallicTexture.channels);
    const roughnessPixel = new Float32Array(roughnessTexture.channels);

    const baseColor = new Color3();
    const specularColor = new Color3();
    
    textureIterator(baseTexture, (x, y) => {
        getTexturePixel(baseTexture, x, y, basePixel);
        getTexturePixel(metallicTexture, x, y, metallicPixel);
        getTexturePixel(roughnessTexture, x, y, roughnessPixel);

    baseColor.set( basePixel[0], basePixel[1], basePixel[2] );
    var metallic = metallicPixel[0];
    var roughness = roughnessPixel[0];

    color3Lerp( dielectricSpecular, baseColor, metallic, specularColor);

    var oneMinusSpecularStrength = 1 - Math.max( specularColor.r, specularColor.g, specularColor.b );
    var diffuse = baseColor.clone().multiplyScalar((1 - dielectricSpecular.r) * (1 - metallic) / Math.max(oneMinusSpecularStrength, epsilon));

    var glossiness = 1 - roughness;

    return {
        specular: specular,
        diffuse: diffuse,
        glossiness: glossiness
    };
}