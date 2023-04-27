import caporal from '@caporal/core';
import {
  readTexture,
  writeTexture,
  remapTextureLocation,
  resolveTextureLocation,
  saveTexture,
  specGlossToMetalRough,
  Texture,
  TextureLocation
} from '@texture-transform/core';

const program = caporal.program;

program.version('1.0.0');
program.description('Material conversion tool.');

const INPUT_DIRECTORY = 'Path to an input images (can be webp, jpg, png, webp)';
const OUTPUT_DIRECTORY =
  'Path to the output images (can be webp, jpg, png, webp)';

const QUALITY = {
  synopsis: '--quality <integer>',
  description: 'The quality of the result in percent',
  options: {
    validator: program.NUMBER,
    default: 100
  }
};

// ROLE
program
  .command('specgloss2pbr', 'Convert from specular-glossiness to PBR')
  .help(
    'Read the diffuse, specular and glossiness textures and create a base, metallic and roughness textures'
  )
  .argument('<input_directory>', INPUT_DIRECTORY)
  .argument('<output_directory>', OUTPUT_DIRECTORY)
  .option(QUALITY.synopsis, QUALITY.description, QUALITY.options)
  .action(async ({ args, options, logger }) => {
    const opts = options as {
      quality: number;
      from: string;
      to: string;
    };
    const inputDirectory = args.input_directory;
    const outputDirectory = args.output_directory;
    const quality = opts.quality;

    logger.info(
      `Converting spec-gloss from ${inputDirectory} to PBR in ${outputDirectory} with quality ${quality}`
    );

    logger.log(`Resolving textures`);
    const diffuseLocationPromise = resolveTextureLocation(inputDirectory, [
      'diffuse'
    ]);
    const specularLocationPromise = resolveTextureLocation(inputDirectory, [
      'specular',
      'spec'
    ]);
    const glossinessLocationPromise = resolveTextureLocation(inputDirectory, [
      'glossiness',
      'gloss'
    ]);

    const [diffuseLocation, specularLocation, glossinessLocation] =
      (await Promise.all([
        diffuseLocationPromise,
        specularLocationPromise,
        glossinessLocationPromise
      ])) as TextureLocation[];

    logger.log(`Loading textures`);
    const [diffuseTexture, specularTexture, glossinessTexture] =
      (await Promise.all([
        readTexture(diffuseLocation.path),
        readTexture(specularLocation.path),
        readTexture(glossinessLocation.path)
      ])) as Texture[];

    logger.log(`Converting textures`);
    const { baseTexture, metallicTexture, roughnessTexture } =
      await specGlossToMetalRough(
        diffuseTexture,
        specularTexture,
        glossinessTexture
      );

    const baseLocation = remapTextureLocation(
      diffuseLocation,
      outputDirectory,
      'base'
    );
    const metallicLocation = remapTextureLocation(
      diffuseLocation,
      outputDirectory,
      'metallic'
    );
    const roughnessLocation = remapTextureLocation(
      diffuseLocation,
      outputDirectory,
      'roughness'
    );

    logger.log(`Saving textures`);

    await Promise.all([
      writeTexture(baseTexture, baseLocation.path, quality),
      writeTexture(metallicTexture, metallicLocation.path, quality),
      writeTexture(roughnessTexture, roughnessLocation.path, quality)
    ]);
  });
