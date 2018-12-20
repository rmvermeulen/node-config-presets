#! /usr/bin/env node
const [...files] = process.argv.slice(0, 2);

if (files.length) {
  // use __dirname to find the presets in node_modules
  const { resolve } = require('path');
  const filesAndPaths = files.map(file => ({
    file,
    path: resolve(__dirname, 'presets', file),
  }));

  const handleError = error => {
    console.error(`Ignoring ${file}`);
    console.error(error.message);
  };

  // use cwd() to copy to caller's directory
  const outDir = process.cwd();
  const { readFile, writeFile } = require('fs');
  for (const [file, path] of filesAndPaths) {
    readFile(path, (error, data) => {
      if (error) {
        return handleError(error);
      }
      const outPath = resolve(outDir, file);
      writeFile(outPath, data, error => {
        if (error) {
          return handleError(error);
        }
      });
    });
  }
}
