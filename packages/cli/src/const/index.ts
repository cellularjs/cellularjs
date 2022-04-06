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
