import { spawn } from 'child_process';
import logSymbols from 'log-symbols';
import { PackageInstallCommands, PackageManager } from '../const';

export function installPackage(cwd: string, packageManager: PackageManager) {
  const installCmd = PackageInstallCommands[packageManager];

  return new Promise((resolve, reject) => {
    const spawnProcess = spawn(installCmd, {
      cwd,
      shell: true,
      stdio: 'inherit',
    });

    spawnProcess.on('exit', (code) => {
      if (code === 0) {
        return resolve(code);
      }

      reject({ msg: `Failed to install package ${logSymbols.error}` });
    });
  });
}
