// @ts-check

const R = require('ramda');
const readline = require('readline');
const bluebird = require('bluebird');
const child_process = require('child_process');

const { copySingle } = require('../copy-files');
const { depsForPreset } = require('./deps');

/** @function init
 * Add or ignore configs one-by-one
 * and get only the required dependencies as output
 */
module.exports = async (presetDir) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /** @type {string[]} */
  const targets = [];

  for (const preset of await require('./list')(presetDir, true)) {
    const yn = await bluebird.fromNode((cb) =>
      rl.question(`copy '${preset}'? [yN] `, (answer) => cb(null, answer)),
    );
    // if y[es], push to targets
    if (/y|yes/i.test(yn)) {
      targets.push(preset);
    }
  }
  const depsAction = await bluebird
    .fromNode((cb) =>
      rl.question(`Deps, list or install with yarn/npm? [Lyn] `, (answer) =>
        cb(null, answer),
      ),
    )
    .then((answer) => {
      if (/y|yarn/i.test(answer)) {
        return 'yarn';
      }
      if (/n|npm/i.test(answer)) {
        return 'npm';
      }
      return 'list';
    });

  rl.close();
  console.log();

  /** @type {(ss: string[]) => string[]} */
  const processDeps = R.pipe(
    R.map(depsForPreset),
    R.unnest,
    R.invoker(0, 'sort'),
    R.uniq,
  );

  // copy targets, filter by success
  const deps = await bluebird
    .filter(targets, async (target) =>
      bluebird
        .resolve(copySingle(presetDir, target))
        .return(true)
        .catchReturn(false),
    )
    .then(processDeps);

  let installer;
  switch (depsAction) {
    case 'list':
      console.log(...deps);
      return;
    case 'yarn':
      installer = child_process.spawn('yarn', ['add', '--dev'].concat(deps), {
        stdio: 'inherit',
      });
      break;
    case 'npm':
      installer = child_process.spawn(
        'npm',
        ['install', '--save-dev'].concat(deps),
        { stdio: 'inherit' },
      );
      break;
    default:
      return;
  }
  return bluebird.fromNode((cb) => installer.on('exit', cb));
};
