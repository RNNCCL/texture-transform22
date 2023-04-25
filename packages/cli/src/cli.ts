import caporal from '@caporal/core';

const program = caporal.program;

program.version('1.0.0');
program.description('Material conversion tool.');

const INPUT_IMAGE = 'Path to an input image (can be webp, jpg, png, webp)';
const OUTPUT_IMAGE = 'Path to the output image  (can be webp, jpg, png, webp)';

// FORMAT
program
	.command('format', 'Convert image format')
	.help("Convert from one image format to another")
	.argument('<input>', INPUT_IMAGE)
	.argument('<output>', OUTPUT_IMAGE)
	.option('--quality <integer>', 'The quality of the result in percent', {
        validator: program.NUMBER,
        default: 100
    })
    .option('--swizzle <string>', 'Convert channels using glsl swizzle style specification', {
        validator: program.STRING,
        default: 'auto'
    })
    .action( async ({ args, options, logger }) => {
        const opts = options as {
            quality: number;
            swizzle: string;
        };
        const input = args.input;
        const output = args.output;
        const quality = opts.quality;
        const swizzle = opts.swizzle;
        logger.info(`Converting ${input} to ${output} with quality ${quality} and swizzle ${swizzle}`);
        await convertFormat(input, output, swizzle, quality);
    });

// PACK
program
	.command('pack', 'Pack multiple images into one')
	.help("Combine multiple images into a single image")
	.argument('<inputs>', INPUT_IMAGE, {
        validator: program.ARRAY,
        default: []
    })
	.argument('<output>', OUTPUT_IMAGE)
	.option('--quality <integer>', 'The quality of the result in percent', {
        validator: program.NUMBER,
        default: 100
    })
    .option('--channels <swizzles>', 'A series of swizzles, one for each input image that specific which channels to extract and combine.', {
		validator: program.STRING,
		default: "auto",
	})
    .action( async ({ args, options, logger }) => {
        const opts = options as {
            quality: number;
            channels: string;
        };
        const inputs = args.inputs;
        const output = args.output;
        const quality = opts.quality;
        const channels = opts.channels;
        logger.info(`Packing ${inputs} to ${output} with quality ${quality} and channels ${channels}`);
        await pack(inputs, channels, output, quality);
    });

// ROLE
program
	.command('role', 'Convert between different texture roles')
	.help("Many common image modifications can be expressed as a function applied to each pixel in the image")
	.argument('<input>', INPUT_IMAGE)
	.argument('<output>', OUTPUT_IMAGE)
	.option('--quality <integer>', 'The quality of the result in percent', {
        validator: program.NUMBER,
        default: 100
    })
    .option('--from <role>', 'The role of the texture: bump, normal, reflect, gloss, metallic, rough, f0, ior.', {
		validator: program.STRING,
        required: true
	})
    .option('--to <role>', 'The role of the texture: bump, normal, reflect, gloss, metallic, rough, f0, ior.', {
		validator: program.STRING,
        required: true
	})
    .action( async ({ args, options, logger }) => {
        const opts = options as {
            quality: number;
            from: string;
            to: string;
        };
        const input = args.input;
        const output = args.output;
        const quality = opts.quality;
        const from = opts.from;
        const to = opts.to;

        logger.info(`Converting ${input} (${from}) to ${output} (${to}) with quality ${quality}`);
        await convertRole(input, from, output, to, quality);
    });