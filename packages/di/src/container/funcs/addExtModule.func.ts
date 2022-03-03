import { Container } from '../../';
import { ExtModuleMeta, ClassType } from '../../types';
import { getModuleMeta } from '../../utils';
import { addExportClassAsProvider } from './addExportClassAsProvider.func';

export async function addExtModule(
  this: Container,
  extModuleMeta: ExtModuleMeta,
) {
  const extModule = new Container();
  const exports = extModuleMeta.exports || [];

  await this.addModule(extModuleMeta.extModule);
  await extModule.addProviders(extModuleMeta.providers);

  for (let i = 0; i < exports.length; i++) {
    const exportCnf = exports[i];
    const moduleMeta = getModuleMeta(exportCnf as ClassType);

    if (moduleMeta) {
      await this.addModule(exportCnf);
      continue;
    }

    await this.addProvider({
      token: exportCnf,
      useModule: extModuleMeta.extModule,
    });

    await addExportClassAsProvider.call(extModule, exportCnf);
  }

  await extModule.addModules(extModuleMeta.imports);

  this._extModules.set(extModuleMeta.extModule, extModule);
}
