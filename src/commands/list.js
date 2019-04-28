// @ts-check

const fs = require('fs');
const bluebird = require('bluebird');
const readdir = bluebird.promisify(fs.readdir);

/** @function list
 * List all available config presets
 */
module.exports = async (presetDir, doReturn = false) => {
  const names = await readdir(presetDir).map((file) =>
    file.replace('preset_', ''),
  );
  if (doReturn) {
    return names;
  }
  for (const name of names) {
    console.log(name);
  }
};
