import * as fs from 'fs';
import * as path from 'path';

export function scanRelTsFiles(dir: string, relativeDir: string): string[] {
  const listFiles = [];

  const scanFolder = (dir, prefix) => {
    const listNewFiles = fs.readdirSync(dir);

    for (let i = 0; i < listNewFiles.length; i++) {
      const newPath = path.join(dir, listNewFiles[i]);
      const lstat = fs.lstatSync(newPath);

      if (lstat.isDirectory()) {
        scanFolder(newPath, prefix + '/' + listNewFiles[i]);
        continue;
      }

      if (!lstat.isFile()) {
        continue;
      }

      const file = listNewFiles[i];
      const isValidTsFile =
        file.lastIndexOf('.js') + 3 === file.length ||
        (file.lastIndexOf('.d.ts') === -1 && file.lastIndexOf('.ts') + 3 === file.length);

      if (!isValidTsFile) {
        continue;
      }

      listFiles.push(prefix + '/' + listNewFiles[i])
    }
  }

  scanFolder(dir, relativeDir);

  return listFiles;
}