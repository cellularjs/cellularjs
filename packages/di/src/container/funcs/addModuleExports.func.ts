import { Container } from '../../';
import { ClassType, ExportableCnf, ExtModuleMeta } from '../../types';
import { getModuleMeta } from '../../utils';

export async function addModuleExports(this: Container, moduleClass: ClassType, exports: ExportableCnf[] = []) {
  for (let i = 0; i < exports.length; i++) {
    const exportCnf = exports[i];
    const moduleMeta = getModuleMeta(<ClassType>exportCnf);

    if (moduleMeta || (<ExtModuleMeta>exportCnf).extModule) {
      await this.addModule(exportCnf);
      continue;
    }

    await this.addProvider({
      token: exportCnf as ClassType,
      useModule: moduleClass,
    });
  }
}
