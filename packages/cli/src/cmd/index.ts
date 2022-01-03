#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { initCmd } from './init.cmd';
import { devCmd } from './dev.cmd';
import { buildCmd } from './build.cmd';
import path from 'path';

const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), {
    encoding: 'utf-8',
  }),
);
const program = new Command('cellular');

program
  .version(packageJson.version)
  .addCommand(initCmd)
  .addCommand(devCmd)
  .addCommand(buildCmd)
  .usage('<command>')
  .parse(process.argv);
