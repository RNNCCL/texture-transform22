import {
  Color3,
  color3Lerp,
  color3MultiplyByScalar,
  color3Subtract
} from '@threeify/math';

import { assert } from '../../helpers/assert';
import { color3LinearToLuma, color3MaxComponent } from '../../helpers/Color3';
import {
  createTexture,
  getTexturePixel,
  setTexturePixel,
  Texture,
  textureIterator
} from '../../Texture';

const dielectricSpecular = new Color3(0.04, 0.04, 0.04);
const epsilon = 1e-6;

// from: https://kcoley.github.io/glTF/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness/examples/convert-between-workflows/

function solveMetallic(
  F0: Color3,
  diffuse: number,
  specular: number,
  oneMinusSpecularStrength: number
) {
  if (specular < F0.r) {
    return 0;
  }

  const a = F0.r;
  const b =
    (diffuse * oneMinusSpecularStrength) / (1 - F0.r) + specular - 2 * F0.r;
  const c = F0.r - specular;
  const D = Math.max(b * b - 4 * a * c, 0);
  return THREE.Math.clamp((-b + Math.sqrt(D)) / (2 * a), 0, 1);
}

export function pbrToSpecularGlossiness(
  diffuseTexture: Texture,
  specularTexture: Texture,
  glossinessTexture: Texture,
  baseTexture = createTexture(diffuseTexture.width, diffuseTexture.height, 3),
  metallicTexture = createTexture(
    diffuseTexture.width,
    diffuseTexture.height,
    3
  ),
  roughnessTexture = createTexture(
    diffuseTexture.width,
    diffuseTexture.height,
    1
  )
): {
  baseTexture: Texture;
  metallicTexture: Texture;
  roughnessTexture: Texture;
} {
  assert(diffuseTexture.channels === 3, 'Diffuse texture must be 3 channel.');
  assert(specularTexture.channels === 3, 'Specular texture must be 3 channel.');
  assert(
    glossinessTexture.channels === 1,
    'Glossiness texture must be 1 channel.'
  );

  assert(baseTexture.channels === 3, 'Base texture must be 3 channel.');
  assert(metallicTexture.channels === 1, 'Metallic texture must be 1 channel.');
  assert(
    roughnessTexture.channels === 1,
    'Roughness texture must be 1 channel.'
  );

  const width = diffuseTexture.width;
  const height = diffuseTexture.height;
  const textures = {
    specularTexture,
    glossinessTexture,
    baseTexture,
    metallicTexture,
    roughnessTexture
  };
  Object.keys(textures).forEach((key) => {
    const texture = textures[key] as Texture;
    assert(
      texture.width === width,
      `All textures must have the same width (${width}), ${key} has width ${texture.width}.`
    );
    assert(
      texture.height === height,
      `All textures must have the same height (${height}), ${key} has height ${texture.height}.`
    );
  });

  const diffuseColor = new Color3();
  const specularColor = new Color3();
  const glossinessPixel = new Float32Array(metallicTexture.channels);

  const baseColorFromDiffuse = new Color3();
  const baseColorFromSpecular = new Color3();
  const baseColor = new Color3();
  const tempColor = new Color3();

  textureIterator(diffuseTexture, (x, y) => {
    getTexturePixel(diffuseTexture, x, y, diffuseColor);
    getTexturePixel(specularTexture, x, y, specularColor);
    getTexturePixel(glossinessTexture, x, y, glossinessPixel);

    const glossiness = glossinessPixel[0];

    const oneMinusSpecularStrength = 1 - color3MaxComponent(specularColor);
    const metallic = solveMetallic(
      dielectricSpecular,
      color3LinearToLuma(diffuseColor),
      color3LinearToLuma(specularColor),
      oneMinusSpecularStrength
    );

    color3MultiplyByScalar(
      diffuseColor,
      oneMinusSpecularStrength /
        (1 - dielectricSpecular.r) /
        Math.max(1 - metallic, epsilon),
      baseColorFromDiffuse
    );

    color3Subtract(
      specularColor,
      color3MultiplyByScalar(dielectricSpecular, 1 - metallic, tempColor),
      baseColorFromSpecular
    );
    color3MultiplyByScalar(
      baseColorFromSpecular,
      1 / Math.max(metallic, epsilon),
      baseColorFromSpecular
    );

    color3Lerp(
      baseColorFromDiffuse,
      baseColorFromSpecular,
      metallic * metallic,
      baseColor
    );

    setTexturePixel(baseTexture, x, y, baseColor);
    setTexturePixel(metallicTexture, x, y, [metallic]);
    setTexturePixel(roughnessTexture, x, y, [1 - glossiness]);
  });

  return {
    baseTexture,
    metallicTexture,
    roughnessTexture
  };
}
