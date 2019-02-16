#! /usr/bin/env node
// @ts-check

const fs = require('fs');
const { resolve, basename } = require('path');

const presetDir = resolve(__dirname, 'presets/');
const args = process.argv.slice(2);

const handleError = (error, file) => {
  console.error(`Ignoring ${file} (${error.code})`);
};

const handleResult = (errorMessage, cb = (_) => {}) => (error, data) => {
  if (error) {
    return handleError(error, errorMessage);
  }
  return cb(data);
};

if (args.length === 0) {
  process.exit();
}

const [cmd, ...tail] = args;

// check for ls/list option
if (cmd === 'ls' || cmd === 'list') {
  fs.readdir(presetDir, (error, files) => {
    if (error) {
      return console.error('something went wrong');
    }
    for (const file of files) {
      console.log(file.replace('preset_', ''));
    }
    process.exit();
  });
}
if (cmd === 'deps') {
  console.log(
    'typescript',
    'husky',
    'lint-staged',
    'tslint',
    'tslint-config-prettier',
    'tslint-eslint-rules',
    'prettier',
    'jest',
    'jest-extended',
    'ts-jest',
    '@types/jest',
    '@types/jest-extended',
    'prettier-package-json',
  );
  process.exit();
}

const files = args;
if (files.length) {
  // use __dirname to find the presets in node_modules
  const filesAndPaths = files.map((file) => ({
    file,
    path: resolve(presetDir, 'preset_' + file),
  }));

  // use cwd() to copy to caller's directory
  const outDir = process.cwd();
  const imDone = () => {
    const goal = filesAndPaths.length;
    let n = 0;
    return () => {
      if (++n === goal) {
        console.log('Done');
      }
    };
  };
  for (const { file, path } of filesAndPaths) {
    const outPath = resolve(outDir, file);
    fs.readFile(path, (error, data) => {
      if (error) {
        console.error('Failed to read', path);
        return imDone();
      }
      fs.writeFile(outPath, data, (error) => {
        if (error) {
          console.error('Failed to write', path);
        }
        imDone();
      });
    });
  }
}
