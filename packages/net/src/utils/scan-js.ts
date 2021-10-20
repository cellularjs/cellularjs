import { readdirSync, statSync } from 'fs';
import * as path from 'path';

type ResolveFactory = (data: { [key: string]: any }) => void;

export function scanJs(basePath: string, onResolve: ResolveFactory): void {
  const files = readdirSync(basePath);

  files.forEach(file => handleFile(
    basePath, file, onResolve,
  ));
}

function handleFile(basePath, file, onResolve: ResolveFactory): void {
  const destPath = path.resolve(basePath, file);
  const stats = statSync(destPath);

  if (stats.isDirectory()) {
    scanJs(destPath, onResolve);
    return;
  }

  const isValidJsFile =
    file.lastIndexOf('.js') + 3 === file.length ||
    (file.lastIndexOf('d.ts') === -1 && file.lastIndexOf('.ts') + 3 === file.length);

  if (!isValidJsFile) return;

  onResolve(require(destPath));
}