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

      const fileName = listNewFiles[i];
      if (!isValidTsFile(fileName)) {
        continue;
      }

      listFiles.push(prefix + '/' + listNewFiles[i]);
    }
  };

  scanFolder(dir, relativeDir);

  return listFiles;
}

function isValidTsFile(fileName: string) {
  return (
    fileName.lastIndexOf('.js') + 3 === fileName.length ||
    (fileName.lastIndexOf('.d.ts') === -1 &&
      fileName.lastIndexOf('.ts') + 3 === fileName.length)
  );
}
