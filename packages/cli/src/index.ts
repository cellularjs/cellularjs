#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { initCmd } from './cmd/init.cmd';

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }));
const program = new Command('cellular');

program
  .version(packageJson.version)
  .addCommand(initCmd)
  .usage("<command>")
  .parse(process.argv);
