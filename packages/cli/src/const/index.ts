export enum PackageManager {
  YARN = 'yarn',
  NPM = 'npm',
}

export const PackageInstallCommands = {
  [PackageManager.YARN]: 'yarn',
  [PackageManager.NPM]: 'npm i',
};

export const RunDevCommands = {
  [PackageManager.YARN]: 'yarn dev',
  [PackageManager.NPM]: 'npm run dev',
};

export const cellularConfigFile = 'cellular.ts';

/**
 * Eg:
 * file.ts => Pass
 * __tests__/file.spec.ts => Fail
 * __tests__/sub/file.ts => Fail
 * file.spec.ts => Fail
 * file.test.ts => Fail
 * file.d.ts => Fail
 */
export const TS_FILE_REGEX_STR =
  '/^(?!.*(__tests__\\/.*).ts$)(?!.*(\\.spec|\\.test|\\.d)\\.ts$).*\\.ts$/';
