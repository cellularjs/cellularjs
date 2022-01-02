const childProcess = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const lernaConfig = fse.readJSONSync(path.resolve(
  __dirname, '..', 'lerna.json'
));

const targetVersion = lernaConfig.version;
const projectPaths = [
  path.resolve(__dirname, '..', 'packages', 'cli', 'src', 'templates', 'halo'),
  path.resolve(__dirname, '..', 'packages', 'net'),
];

projectPaths.forEach(projectPath => {
  const packageJsonPath = path.resolve(projectPath, 'package.json');
  const packageData = fse.readJSONSync(packageJsonPath, { encoding: 'utf-8' });

  packageData.dependencies && Object.keys(packageData.dependencies).forEach(key => {
    if (!key.startsWith('@cellularjs/')) {
      return;
    }
  
    packageData.dependencies[key] = targetVersion;
  });

  packageData.peerDependencies && Object.keys(packageData.peerDependencies).forEach(key => {
    if (!key.startsWith('@cellularjs/')) {
      return;
    }
  
    packageData.peerDependencies[key] = targetVersion;
  });
  
  fse.writeJSONSync(packageJsonPath, packageData, { encoding: 'utf-8', spaces: 2 });
  
  childProcess.execSync('git add ' + packageJsonPath);
});
