#! /usr/bin/env node
// @ts-check
const [...files] = process.argv.slice(2);

if (files.length) {
  // use __dirname to find the presets in node_modules
  const { resolve, basename } = require('path');
  const filesAndPaths = files.map(file => ({
    file,
    path: resolve(__dirname, 'presets/', file),
  }));

  const handleError = (error, file) => {
    console.error(`Ignoring ${file} (${error.code})`);
  };

  // use cwd() to copy to caller's directory
  const outDir = process.cwd();
  const { readFile, writeFile } = require('fs');
  for (const { file, path } of filesAndPaths) {
    const outPath = resolve(outDir, file);
    readFile(path, (error, data) => {
      if (error) {
        return handleError(error, file);
      }
      writeFile(outPath, data, error => {
        if (error) {
          return handleError(error, basename(outPath));
        }
      });
    });
  }
}
