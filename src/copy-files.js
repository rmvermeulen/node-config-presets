// @ts-check

const fs = require('fs');
const { resolve } = require('path');
const bluebird = require('bluebird');

const readFile = bluebird.promisify(fs.readFile);
const writeFile = bluebird.promisify(fs.writeFile);

const presetFilePath = (presetDir, file) =>
  resolve(presetDir, `preset_${file}`);

// use cwd() to copy to caller's directory
const copySingle = async (presetDir, file, outDir = process.cwd()) => {
  const path = presetFilePath(presetDir, file);
  const outPath = resolve(outDir, file);
  const data = await readFile(path).catchThrow(
    new Error(`Failed to read ${path}`),
  );
  await writeFile(outPath, data).catchThrow(
    new Error(`Failed to write ${path}`),
  );
  console.log(`copied preset ${file}`);
};

module.exports = async (presetDir, files) => {
  let count = 0;
  bluebird
    .each(files, (file) =>
      copySingle(presetDir, file)
        .then(() => ++count)
        .catch(({ message }) => {
          console.error(message);
        }),
    )
    .finally(() => {
      console.log(`done ${count}/${files.length}`);
    });
};

module.exports.copySingle = copySingle;
