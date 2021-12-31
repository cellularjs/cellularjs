import * as path from 'path';
import { Command } from 'commander';
import { webpack } from 'webpack';
import chalk from 'chalk';
import * as fse from 'fs-extra';
import { CellularConfig } from '../';
import { cellularConfigFile } from '../const'
import { getBaseConfig } from '../const/webpack.config'

function handleDevCmd(entryName: string) {
  const configFilePath = path.resolve(process.cwd(), cellularConfigFile);
  if (!fse.existsSync(configFilePath)) {
    return console.log(chalk.red(`There is no "${cellularConfigFile}" file in ${process.cwd()}!`))
  }

  const cellularCnf = getCellularConfig();
  const entryPath = cellularCnf.entry[entryName];

  if (!entryPath) {
    return console.log(chalk.red(`There is no entry name "${entryName}", let check entry field in "${cellularConfigFile}"!`));
  }

  let webpackConfig = getBaseConfig(entryName);
  webpackConfig.entry = { [entryName]: path.resolve(process.cwd(), entryPath) };

  if (cellularCnf.webpack) {
    const newWebpackConfig = cellularCnf.webpack(webpackConfig);

    if (!newWebpackConfig) {
      return console.log(chalk.red(`webpack function in "${cellularConfigFile}" file need return configuration!`));
    }

    webpackConfig = newWebpackConfig;
  }

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(stats.compilation.errors[0])
    }
  });
}

function getCellularConfig(): CellularConfig {
  const configFilePath = path.resolve(process.cwd(), cellularConfigFile);

  if (!fse.existsSync(configFilePath)) {
    console.log(chalk.red(`There is no "${cellularConfigFile}" file in ${process.cwd()}`))
    return process.exit(1);
  }

  require('ts-node/register');
  return require(configFilePath).default;
}

export const devCmd = new Command('dev')
  .option('-e, --entry <name>', 'Entry name, it is declared inside file "cellular.ts"')
  .action((args) => {
    if (!args.entry) {
      return console.log(chalk.cyanBright('Missing entry name\n(Correct example: cellular dev -e http)'));
    }

    handleDevCmd(args.entry);
  });