// @ts-check

const fs = require("fs");
const { resolve, basename } = require("path");
const bluebird = require("bluebird");

const readFile = bluebird.promisify(fs.readFile);
const writeFile = bluebird.promisify(fs.writeFile);

module.exports = async (presetDir,files) => {
  // use __dirname to find the presets in node_modules
  const filesAndPaths = files.map(file => ({
    file,
    path: resolve(presetDir, "preset_" + file)
  }));

  // use cwd() to copy to caller's directory
  const outDir = process.cwd();
  let count = 0;
  bluebird
    .each(filesAndPaths, ({ file, path }) =>
      bluebird
        .try(async () => {
          const outPath = resolve(outDir, file);
          const data = await readFile(path).catchThrow(
            new Error(`Failed to read ${path}`)
          );
          await writeFile(outPath, data).catchThrow(
            new Error(`Failed to write ${path}`)
          );
        })
        .then(() => ++count)
        .catch(({ message }) => {
          console.error(message);
        })
    )
    .finally(() => {
      console.log(`done ${count}/${filesAndPaths.length}`);
    });
};
