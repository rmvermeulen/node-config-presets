// @ts-check

const fs = require("fs");
const bluebird = require("bluebird");
const readdir = bluebird.promisify(fs.readdir);

/** @function list
 * List all available config presets
 */
module.exports = async presetDir => {
  const files = await readdir(presetDir);
  for (const file of files) {
    console.log(file.replace("preset_", ""));
  }
};
