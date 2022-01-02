import * as path from 'path';
import * as fse from 'fs-extra';

const templateName = 'halo';

export function createProjectStructure(cwd: string, projectName: string) {
  const projectRootPath = path.resolve(cwd, projectName);
  const templatePath = path.resolve(__dirname, '..', 'templates', templateName);

  // Copy template:
  fse.copySync(templatePath, projectRootPath);

  // Edit project name:
  const packageJsonPath = path.resolve(projectRootPath, 'package.json');
  const packageJson = fse.readJSONSync(packageJsonPath, { encoding: 'utf-8' });
  packageJson.name = projectName;
  fse.writeJSONSync(packageJsonPath, packageJson, {
    encoding: 'utf-8',
    spaces: 2,
  });

  // https://stackoverflow.com/q/24976950
  fse.moveSync(
    path.resolve(projectRootPath, 'gitignore'),
    path.resolve(projectRootPath, '.gitignore'),
  );
}
