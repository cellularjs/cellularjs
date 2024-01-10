import { readdirSync, statSync } from 'fs';
import * as path from 'path';
import { validTsReg } from '../const';

type ResolveFactory = (data: { [key: string]: any }) => void;

export function scanJs(basePath: string, onResolve: ResolveFactory): void {
  const files = readdirSync(basePath);

  files.forEach((file) => handleFile(basePath, file, onResolve));
}

function handleFile(basePath, file, onResolve: ResolveFactory): void {
  const destPath = path.resolve(basePath, file);
  const stats = statSync(destPath);

  if (stats.isDirectory()) {
    scanJs(destPath, onResolve);
    return;
  }

  if (!validTsReg.test(destPath)) return;

  onResolve(require(destPath));
}
