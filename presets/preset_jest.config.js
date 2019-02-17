module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    'jest-extended',
    'jest-watch-suspend',
    'jest-watch-typeahead',
    'jest-watch-toggle-config',
    'expect-more-jest',
  ],
  setupTestFrameworkScriptFile: './setupJest.ts',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['setupJest', '.json'],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
