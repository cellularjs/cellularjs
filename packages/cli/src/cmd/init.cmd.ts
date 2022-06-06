import { Command } from 'commander';
import * as path from 'path';
import validateProjectName from 'validate-npm-package-name';
import { prompt, QuestionCollection } from 'inquirer';
import * as fse from 'fs-extra';
import chalk from 'chalk';
import { Spinner } from 'clui';
import * as tmp from 'tmp-promise';
import logSymbols from 'log-symbols';
import { PackageManager, RunDevCommands } from '../const';
import { createProjectStructure, installPackage } from '../task';

const initQuestions: QuestionCollection = [
  {
    message: 'Project name:',
    name: 'projectName',
    type: 'input',
    validate: (projectName) => {
      if (!projectName) {
        console.log(chalk.red('(This input is required!)'));
        return false;
      }

      const validateRs = validateProjectName(projectName);
      if (!validateRs.validForNewPackages) {
        console.log(
          chalk.red(
            ' (Project name must follow npm package name rules - eg: my-project)',
          ),
        );
        return false;
      }

      const targetFolderPath = path.resolve(process.cwd(), projectName);
      if (fse.pathExistsSync(targetFolderPath)) {
        console.log(
          chalk.red(
            ` ("${targetFolderPath}" is exists, you need to use another name!)`,
          ),
        );
        return false;
      }

      return true;
    },
  },
  {
    message: 'What package manager do you want to use:',
    name: 'packageManager',
    type: 'list',
    choices: [
      { name: 'yarn', value: PackageManager.YARN },
      { name: 'npm', value: PackageManager.NPM },
    ],
  },
];

type InitAnswer = {
  packageManager: PackageManager;
  projectName: string;
};

const handleInit = async () => {
  const initAnswer = await prompt<InitAnswer>(initQuestions);
  const { projectName, packageManager } = initAnswer;
  const newProjectPath = path.resolve(process.cwd(), projectName);

  console.log('');
  console.log('-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-');
  console.log('');
  console.log(chalk.green('Start genarating project:'));

  // 1: init temporary dir
  const tmpDir = await tmp.dir();
  const tmpProjectPath = path.resolve(tmpDir.path, projectName);

  // 2:
  createProjectStructure(tmpDir.path, projectName);
  console.log(`Project structure created ${logSymbols.success}`);

  // 3:
  await installPackage(tmpProjectPath, packageManager);
  console.log(`Package installed ${logSymbols.success}`);

  // 4:
  await finalize(tmpProjectPath, newProjectPath);
  // await tmpDir.cleanup();

  console.log();
  console.log('Done, let tweak and create your first commit 🐘');
  console.log();
  console.log(`Run dev:`);
  console.log(`$ cd ./${projectName}`);
  console.log(`$ ${RunDevCommands[packageManager]}`);
};

function finalize(tmpProjectPath, newProjectPath) {
  const spinner = new Spinner('Finalizing...');
  spinner.start();

  return new Promise(async (resolve, reject) => {
    try {
      await fse.copy(tmpProjectPath, newProjectPath);
      resolve(1);
    } catch (e) {
      reject({ msg: `Failed to create project` });
    } finally {
      spinner.stop();
    }
  });
}

// cellular init
export const initCmd = new Command('init')
  .description('Init new CelluarJS project')
  .action(async () => {
    try {
      await handleInit();
    } catch (err) {
      if (err.msg) {
        console.log(err.msg);
        return;
      }

      console.log(err);
    }
  });
