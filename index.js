const { resolve } = require('path');

const main = require('./src');

const args = process.argv.slice(2);
const presetDir = resolve(__dirname, 'presets/');

main(presetDir, args)
  .then(() => process.exit())
  .catch(({ message }) => {
    console.error(message);
    process.exit(1);
  });
