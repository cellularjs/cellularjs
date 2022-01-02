import { Container } from '../../';
import { ExtModuleMeta, ClassType } from '../../types';
import { getModuleMeta } from '../../utils';

export async function addExtModule(
  this: Container,
  extModuleMeta: ExtModuleMeta,
) {
  await this.addModule(extModuleMeta.extModule);

  const extModule = new Container();
  await extModule.addProviders(extModuleMeta.providers);

  const exports = extModuleMeta.exports || [];
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

    await extModule.addProvider(exportCnf as ClassType);
  }

  await extModule.addModules(extModuleMeta.imports);

  this._extModules.set(extModuleMeta.extModule, extModule);
}
