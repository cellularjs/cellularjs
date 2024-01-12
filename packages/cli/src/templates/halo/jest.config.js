/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: './src',

  testEnvironment: 'node',

  // Ref: https://stackoverflow.com/a/51174924
  moduleDirectories: ['node_modules', 'src'],

  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    "**/*.{ts,js}",
    "!**/node_modules/**"
  ],

  transform: {
    // Ref: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/isolatedModules
    '^.+\\.ts?$': ['ts-jest', { isolatedModules: true }],
  },

  silent: true,
};