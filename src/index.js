#! /usr/bin/env node
// @ts-check
const printHelp = () => {
  // @ts-ignore
  const { version } = require('./package.json');

  console.log(`node config presets v${version}
copy preset config files into current directory

usage:
  $ config-presets [-h/--help]   # print help
  $ config-presets [command]     # run command
  $ config-presets [...files]    # copy given files

options:
  -h,--help       print this help information

commands:
  init            interactively copy files and list deps
  ls,list         list config files
  deps            list all transient devDependencies
  `);
};

module.exports = async (presetDir, args) => {
  if (args.length === 0) {
    printHelp();
    return;
  }

  const [cmd, ...tail] = args;

  if (['-h', '--help', 'help'].includes(cmd)) {
    printHelp();
    return;
  }

  let cmdFn;
  switch (cmd) {
    case 'init':
      cmdFn = require('./commands/init');
      break;
    case 'ls':
    case 'list':
      cmdFn = require('./commands/list');
      break;
    case 'deps':
      cmdFn = require('./commands/deps');
      break;
  }

  if (cmdFn) {
    return cmdFn(presetDir);
  }

  const files = args;
  if (files.length) {
    return require('./copy-files')(presetDir, files);
  }
};
