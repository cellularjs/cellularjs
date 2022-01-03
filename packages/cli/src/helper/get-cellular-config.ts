import * as path from 'path';
import chalk from 'chalk';
import * as fse from 'fs-extra';
import { CellularConfig } from '../';
import { cellularConfigFile } from '../const';

export function getCellularConfig(): CellularConfig {
  const configFilePath = path.resolve(process.cwd(), cellularConfigFile);

  if (!fse.existsSync(configFilePath)) {
    console.log(
      chalk.red(
        `There is no "${cellularConfigFile}" file in ${process.cwd()}!`,
      ),
    );
    process.exit(1);
  }

  require('ts-node/register');
  const cellularCnf = require(configFilePath).default;

  return cellularCnf;
}
