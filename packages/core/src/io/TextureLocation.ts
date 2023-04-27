import fsPromises from 'node:fs/promises';
import path from 'node:path';

export type TextureLocation = {
  path: string;
  directory: string;
  stub: string;
  role: string;
  extension: string;
};

// search the directory for a file with the postfix, before the extension of "role"
// if it exists, returns a TextureLocation with all the details
// otherwise this function throws an exception
export async function resolveTextureLocation(
  directory: string,
  roles: string[]
) {
  // check if directory exists
  await fsPromises.access(directory, fsPromises.constants.R_OK);

  // get a list of all files in the directory
  const allFiles = await fsPromises.readdir(directory);
  // find the file with the postfix, excluding the extension
  const matchingFiles = allFiles.filter((file) => {
    const rawFilename = path.basename(file, path.extname(file));
    for (const role in roles) {
      if (rawFilename.endsWith(role)) {
        return true;
      }
    }
    return false;
  });
  if (matchingFiles.length === 0) {
    throw new Error(
      `Could not find a texture in ${directory} for any of the roles: ${roles.join(
        ', '
      )}`
    );
  }
  if (matchingFiles.length > 1) {
    throw new Error(
      `Found multiple textures in ${directory} for the roles: ${roles.join(
        ', '
      )}`
    );
  }

  const file = matchingFiles[0];
  // split the file into the prefix and extension
  const extension = path.extname(file);
  const fileName = path.basename(file, extension);

  const role = roles.find((role) => fileName.endsWith(role));
  const stub = fileName.slice(0, -role.length);

  // return the TextureLocation
  return {
    path: path.join(directory, file),
    directory,
    stub,
    role,
    extension
  };
}

export function remapTextureLocation(
  sourceLocation: TextureLocation,
  directory: string,
  role: string
) {
  const { stub, extension } = sourceLocation;
  const filename = `${stub}${role}${extension}`;
  return {
    path: path.join(directory, filename),
    directory,
    stub,
    role,
    extension
  };
}
