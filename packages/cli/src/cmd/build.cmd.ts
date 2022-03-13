import { Command } from 'commander';
import { webpack } from 'webpack';
import chalk from 'chalk';
import { getCellularConfig } from '../helper/get-cellular-config';
import { getWebpackConfig } from '../helper/get-webpack-config';

function handleBuildCmd(entries: string[]) {
  const cellularCnf = getCellularConfig();
  const webpackConfig = getWebpackConfig(cellularCnf, entries, 'production');

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(stats.compilation.errors[0]);
    }
  });
}

export const buildCmd = new Command('build')
  .option(
    '-e, --entry [name...]',
    'Entry name, it is declared inside file "cellular.ts"',
  )
  .action((args) => {
    if (args.entry.length === 0) {
      return console.log(
        chalk.cyanBright(
          'Missing entry name\n(Correct example: cellular build -e http)',
        ),
      );
    }

    handleBuildCmd(args.entry);
  });
