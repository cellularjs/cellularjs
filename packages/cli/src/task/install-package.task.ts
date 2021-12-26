import { spawn } from 'child_process';
import { Spinner } from 'clui';
import logSymbols from 'log-symbols';
import { PackageInstallCommands, PackageManager } from '../const';

export function installPackage(cwd: string, packageManager: PackageManager) {
  const installCmd = PackageInstallCommands[packageManager];
  const spinner = new Spinner('Installing packages...');

  spinner.start();

  return new Promise((resolve, reject) => {
    const spawnProcess = spawn(installCmd, {
      cwd,
      shell: true,
    });

    spawnProcess.on('exit', code => {
      spinner.stop();

      if (code === 0) {
        return resolve(code);
      }

      reject({ msg: `Failed to install package ${logSymbols.error}` })
    });
  })
}