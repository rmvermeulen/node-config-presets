#! /usr/bin/env node
// @ts-check

const fs = require('fs');
const { resolve, basename } = require('path');

const presetDir = resolve(__dirname, 'presets/');
const args = process.argv.slice(2);

const handleError = (error, file) => {
  console.error(`Ignoring ${file} (${error.code})`);
};

const handleResult = (cb = _ => {}) => (error, data) => {
  if (error) {
    return handleError(error);
  }
  return cb(data);
};

if (args.length === 0) {
  process.exit();
}

const [cmd, ...tail] = args;

// check for ls/list option
if (cmd === 'ls' || cmd === 'list') {
  fs.readdir(
    presetDir,
    handleResult(files => {
      for (const file of files) {
        console.log(file);
      }
      process.exit();
    }),
  );
}

const files = args;
if (files.length) {
  // use __dirname to find the presets in node_modules
  const filesAndPaths = files.map(file => ({
    file,
    path: resolve(presetDir, file),
  }));

  // use cwd() to copy to caller's directory
  const outDir = process.cwd();
  for (const { file, path } of filesAndPaths) {
    const outPath = resolve(outDir, file);
    fs.readFile(
      path,
      handleResult(data => fs.writeFile(outPath, data, handleResult())),
    );
  }
}
