#! /usr/bin/env node
// @ts-check

const fs = require("fs");
const { resolve, basename } = require("path");

const presetDir = resolve(__dirname, "presets/");
const args = process.argv.slice(2);

const handleError = (error, file) => {
  console.error(`Ignoring ${file} (${error.code})`);
};

const handleResult = (errorMessage, cb = _ => {}) => (error, data) => {
  if (error) {
    return handleError(error, errorMessage);
  }
  return cb(data);
};

const printHelp = () => {
  // @ts-ignore
  const { version } = require("./package.json");
  console.log(`node config presets v${version}
copy preset config files into current directory

usage:
  $ config-presets [options] [command] [filenames]

options:
  -h,--help       print this help information

commands:
  ls              list config files
  deps            list all transient devDependencies
  `);
};

if (args.length === 0) {
  printHelp();
  process.exit();
}

const [cmd, ...tail] = args;

if (["-h", "--help", "help"].includes(cmd)) {
  printHelp();
  process.exit();
}

// check for ls/list option
if (cmd === "ls" || cmd === "list") {
  fs.readdir(presetDir, (error, files) => {
    if (error) {
      return console.error("something went wrong");
    }
    for (const file of files) {
      console.log(file.replace("preset_", ""));
    }
    process.exit();
  });
}
if (cmd === "deps") {
  console.log(
    "@types/jest",
    "expect-more-jest",
    "husky",
    "jest-extended",
    "jest-extended",
    "jest-watch-suspend",
    "jest-watch-toggle-config",
    "jest-watch-typeahead",
    "jest",
    "lint-staged",
    "prettier-package-json",
    "pretty-quick",
    "ts-jest",
    "tslint-config-prettier",
    "tslint-eslint-rules",
    "tslint",
    "typescript"
  );
  process.exit();
}

const files = args;
if (files.length) {
  // use __dirname to find the presets in node_modules
  const filesAndPaths = files.map(file => ({
    file,
    path: resolve(presetDir, "preset_" + file)
  }));

  // use cwd() to copy to caller's directory
  const outDir = process.cwd();
  const imDone = () => {
    const goal = filesAndPaths.length;
    let n = 0;
    return () => {
      if (++n === goal) {
        console.log("Done");
      }
    };
  };
  for (const { file, path } of filesAndPaths) {
    const outPath = resolve(outDir, file);
    fs.readFile(path, (error, data) => {
      if (error) {
        console.error("Failed to read", path);
        return imDone();
      }
      fs.writeFile(outPath, data, error => {
        if (error) {
          console.error("Failed to write", path);
        }
        imDone();
      });
    });
  }
}
