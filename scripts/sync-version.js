const childProcess = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const lernaConfig = fse.readJSONSync(path.resolve(
  __dirname, '..', 'lerna.json'
));

const targetVersion = lernaConfig.version;
const builtTemplatePackageJson = path.resolve(__dirname, '..', 'packages', 'cli', 'dist', 'templates', 'halo', 'package.json');
const projectPaths = [
  path.resolve(__dirname, '..', 'packages', 'cli', 'src', 'templates', 'halo'),
  path.resolve(__dirname, '..', 'packages', 'net'),
  path.resolve(__dirname, '..', 'packages', 'di'),
  path.resolve(__dirname, '..', 'packages', 'cli'),
];

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

syncPackageVersion(builtTemplatePackageJson);

projectPaths.forEach(projectPath => {
  const packageJsonPath = path.resolve(projectPath, 'package.json');
  syncPackageVersion(packageJsonPath);

  childProcess.execSync(`git add ${packageJsonPath}`);
});

