/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: '..',

  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.{spec,test}.ts'],

  coverageProvider: 'v8',
  coverageDirectory: './coverage-e2e',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.{spec,test}.{ts,js}',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],

  // Ref: https://stackoverflow.com/a/51174924
  moduleDirectories: ['node_modules', 'src'],

  transform: {
    // Ref: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/isolatedModules/#performance
    '^.+\\.ts?$': ['ts-jest', { isolatedModules: true }],
  },
  
  setupFilesAfterEnv: ['./test/setup.ts'],

  silent: true,
};
