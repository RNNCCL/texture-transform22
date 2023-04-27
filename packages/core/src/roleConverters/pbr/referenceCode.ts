let THREE;
(function (THREE) {
  const PbrUtilities = (function () {
    function PbrUtilities() {}

    const dielectricSpecular = new THREE.Color(0.04, 0.04, 0.04);
    const epsilon = 1e-6;

    PbrUtilities.DielectricSpecular = dielectricSpecular;

    PbrUtilities.ConvertToSpecularGlossiness = function (metallicRoughness) {
      const baseColor = metallicRoughness.baseColor;
      const metallic = metallicRoughness.metallic;
      const roughness = metallicRoughness.roughness;

      const specular = dielectricSpecular.clone().lerp(baseColor, metallic);

      const oneMinusSpecularStrength = 1 - specular.getMaxComponent();
      const diffuse = baseColor
        .clone()
        .multiplyScalar(
          ((1 - dielectricSpecular.r) * (1 - metallic)) /
            Math.max(oneMinusSpecularStrength, epsilon)
        );

      const glossiness = 1 - roughness;

      return {
        specular: specular,
        diffuse: diffuse,
        glossiness: glossiness
      };
    };

    PbrUtilities.ConvertToMetallicRoughness = function (specularGlossiness) {
      function solveMetallic(diffuse, specular, oneMinusSpecularStrength) {
        if (specular < dielectricSpecular.r) {
          return 0;
        }

        const a = dielectricSpecular.r;
        const b =
          (diffuse * oneMinusSpecularStrength) / (1 - dielectricSpecular.r) +
          specular -
          2 * dielectricSpecular.r;
        const c = dielectricSpecular.r - specular;
        const D = Math.max(b * b - 4 * a * c, 0);
        return THREE.Math.clamp((-b + Math.sqrt(D)) / (2 * a), 0, 1);
      }

      const diffuse = specularGlossiness.diffuse;
      const specular = specularGlossiness.specular;
      const glossiness = specularGlossiness.glossiness;

      const oneMinusSpecularStrength = 1 - specular.getMaxComponent();
      const metallic = solveMetallic(
        diffuse.getPerceivedBrightness(),
        specular.getPerceivedBrightness(),
        oneMinusSpecularStrength
      );

      const baseColorFromDiffuse = diffuse
        .clone()
        .multiplyScalar(
          oneMinusSpecularStrength /
            (1 - dielectricSpecular.r) /
            Math.max(1 - metallic, epsilon)
        );
      const baseColorFromSpecular = specular
        .clone()
        .sub(dielectricSpecular.clone().multiplyScalar(1 - metallic))
        .multiplyScalar(1 / Math.max(metallic, epsilon));
      const baseColor = baseColorFromDiffuse
        .clone()
        .lerp(baseColorFromSpecular, metallic * metallic)
        .clamp();

      return {
        baseColor: baseColor,
        metallic: metallic,
        roughness: 1 - glossiness
      };
    };

    return PbrUtilities;
  })();
  THREE.PbrUtilities = PbrUtilities;
})(THREE || (THREE = {}));
