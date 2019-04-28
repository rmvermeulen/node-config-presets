// @ts-check

const R = require('ramda');

const depMap = {
  '.prettierrc': ['prettier'],
  'husky.config.js': ['husky', 'lint-staged', 'pretty-quick', 'prettier'],
  'jest.config.js': [
    'jest',
    'ts-jest',
    '@types/jest',
    'jest-watch-typeahead',
    'jest-watch-suspend',
    'jest-extended',
    'expect-more-jest',
  ],
  'lint-staged.config.js': ['prettier-package-json', 'tslint', 'jest'],
  'tslint.json': [
    'typescript',
    'tslint',
    'tslint-eslint-rules',
    'tslint-config-prettier',
  ],
};

/** @function deps
 * List all devDependencies used by included configs
 */
module.exports = async () =>
  R.pipe(
    R.flatten,
    R.invoker(0, 'sort'),
    R.uniq,
    R.apply(console.log),
  )(Object.values(depMap));

module.exports.depsForPreset = (preset) => depMap[preset] || [];
