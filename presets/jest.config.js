module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: './setupJest.ts',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['setupJest'],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
