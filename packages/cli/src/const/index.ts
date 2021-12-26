export enum PackageManager {
  YARN = 'yarn',
  NPM = 'npm',
}

export const PackageInstallCommands = {
  [PackageManager.YARN]: 'yarn',
  [PackageManager.NPM]: 'npm i',
}
