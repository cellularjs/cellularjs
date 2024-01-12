/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: '.',

  testEnvironment: 'node',

  // Ref: https://stackoverflow.com/a/51174924
  moduleDirectories: ['node_modules', 'src'],

  transform: {
    // Ref: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/isolatedModules/#performance
    '^.+\\.ts?$': ['ts-jest', { isolatedModules: true }],
  },

  // globalSetup: './setup.ts',
  // globalTeardown: './teardown.ts',
  setupFilesAfterEnv: ['./setup.ts'],

  silent: true,
};
