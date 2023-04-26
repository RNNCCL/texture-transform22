import { Color3, color3Lerp, color3MultiplyByScalar } from "@threeify/math";
import { Texture, createTexture, getTexturePixel, setTexturePixel, textureIterator } from "../../Texture";
import { assert } from "../../helpers/assert";
import { color3MaxComponent } from "../../helpers/Color3.Helpers";

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
    assert( baseTexture.channels === 3, "Base texture must be 3 channel." );
    assert( metallicTexture.channels === 1, "Metallic texture must be 1 channel." );
    assert( roughnessTexture.channels === 1, "Roughness texture must be 1 channel." );

    assert( diffuseTexture.channels === 3, "Diffuse texture must be 3 channel." );
    assert( specularTexture.channels === 3, "Specular texture must be 3 channel." );
    assert( glossinessTexture.channels === 1, "Glossiness texture must be 1 channel." );

    const width = baseTexture.width;
    const height = baseTexture.height;
    const textures = { metallicTexture, roughnessTexture, diffuseTexture, specularTexture, glossinessTexture };
    Object.keys(textures ).forEach( key => {
        const texture = textures[key] as Texture;
        assert( texture.width === width, `All textures must have the same width (${width}), ${key} has width ${texture.width}.` );
        assert( texture.height === height, `All textures must have the same height (${height}), ${key} has height ${texture.height}.` );
    });
    
    // TODO: confirm all 3 input textures are the same size.
    // TODO: confirm base texture is 3 channel, the others are 1 channel.

    const baseColor = new Color3();
    const metallicPixel = new Float32Array(metallicTexture.channels);
    const roughnessPixel = new Float32Array(roughnessTexture.channels);

    const diffuseColor = new Color3();
    const specularColor = new Color3();
    
    textureIterator(baseTexture, (x, y) => {
        getTexturePixel(baseTexture, x, y, baseColor);
        getTexturePixel(metallicTexture, x, y, metallicPixel);
        getTexturePixel(roughnessTexture, x, y, roughnessPixel);

        var metallic = metallicPixel[0];
        var roughness = roughnessPixel[0];

        color3Lerp( dielectricSpecular, baseColor, metallic, specularColor);

        var oneMinusSpecularStrength = 1 - color3MaxComponent( specularColor );
        const diffuseFactor = (1 - dielectricSpecular.r) * (1 - metallic) / Math.max(oneMinusSpecularStrength, epsilon);
        color3MultiplyByScalar( baseColor, diffuseFactor, diffuseColor );

        var glossiness = 1 - roughness;

        setTexturePixel(diffuseTexture, x, y, diffuseColor);
        setTexturePixel(specularTexture, x, y, specularColor);
        setTexturePixel(glossinessTexture, x, y, [glossiness]);
    });

    return {
        specularTexture,
        diffuseTexture,
        glossinessTexture
    };
}