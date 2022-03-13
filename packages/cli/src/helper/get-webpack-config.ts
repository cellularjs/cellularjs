import * as path from 'path';
import chalk from 'chalk';
import { Configuration } from 'webpack';
import * as fse from 'fs-extra';
import NodemonPlugin from 'nodemon-webpack-plugin';
import { cellularConfigFile } from '../const';
import { getBaseWebpackConfig } from './base-webpack';
import { CellularConfig } from '../';

type WebpackMode = 'none' | 'development' | 'production';

export function getWebpackConfig(
  cellularCnf: CellularConfig,
  entries: string[],
  mode: WebpackMode,
) {
  const webpackEntry = {};
  entries.forEach((entryName) => {
    webpackEntry[entryName] = getEntryAbsPath(cellularCnf, entryName);
  });

  const baseWebpackConfig = getBaseWebpackConfig();
  const webpackConfig: Configuration = {
    ...baseWebpackConfig,
    mode,
    watch: mode === 'development',
    optimization: { minimize: mode === 'production' },
    entry: webpackEntry,
    plugins: getDefaultPlugins(baseWebpackConfig, mode),
  };

  if (cellularCnf.webpack) {
    return overrideWebpackConfig(cellularCnf, webpackConfig);
  }

  return webpackConfig;
}

function getDefaultPlugins(
  baseWebpackConfig: Configuration,
  mode: WebpackMode,
) {
  return mode === 'development'
    ? [...baseWebpackConfig.plugins, new NodemonPlugin()]
    : baseWebpackConfig.plugins;
}

function overrideWebpackConfig(
  cellularCnf: CellularConfig,
  webpackConfig: Configuration,
) {
  const newWebpackConfig = cellularCnf.webpack(webpackConfig);

  if (!newWebpackConfig) {
    console.log(
      chalk.red(
        `webpack function in "${cellularConfigFile}" file need return webpack configuration!`,
      ),
    );
    process.exit(1);
  }

  return newWebpackConfig;
}

function getEntryAbsPath(cellularCnf: CellularConfig, entryName: string) {
  const entryRlPath = cellularCnf.entry[entryName];

  if (!entryRlPath) {
    console.log(
      chalk.red(
        `There is no entry name "${entryName}", let check entry field in "${cellularConfigFile}"!`,
      ),
    );
    process.exit(1);
  }

  const entryAbsPath = path.resolve(process.cwd(), entryRlPath);
  if (!fse.existsSync(entryAbsPath)) {
    console.log(
      chalk.red(
        `There is no "${entryAbsPath}" file, you need to check file path of "${entryName}" entry!`,
      ),
    );
    process.exit(1);
  }

  return entryAbsPath;
}
