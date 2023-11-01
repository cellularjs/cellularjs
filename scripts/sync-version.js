const childProcess = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const lernaConfig = fse.readJSONSync(path.resolve(`${__dirname}/../lerna.json`));

const targetVersion = lernaConfig.version;

function syncPackageVersion(packageJsonPath) {
  const packageData = fse.readJSONSync(packageJsonPath, { encoding: 'utf-8' });

  packageData.dependencies && Object.keys(packageData.dependencies).forEach(key => {
    if (!key.startsWith('@cellularjs/')) {
      return;
    }

    packageData.dependencies[key] = `^${targetVersion}`;
  });

  packageData.peerDependencies && Object.keys(packageData.peerDependencies).forEach(key => {
    if (!key.startsWith('@cellularjs/')) {
      return;
    }

    packageData.peerDependencies[key] = `^${targetVersion}`;
  });

  packageData.devDependencies && Object.keys(packageData.devDependencies).forEach(key => {
    if (!key.startsWith('@cellularjs/')) {
      return;
    }

    packageData.devDependencies[key] = `^${targetVersion}`;
  });

  fse.writeJSONSync(packageJsonPath, packageData, { encoding: 'utf-8', spaces: 2 });
}

const packageJsonPath = path.resolve(`${__dirname}/../packages/cli/src/templates/halo/package.json`);
syncPackageVersion(packageJsonPath);

childProcess.execSync(`git add .`);

childProcess.execSync(`yarn build`);