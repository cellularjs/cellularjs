import { Container } from '../../'
import { Errors, ClassType } from '../../internal'
import { getModuleMeta } from '../../utils';
import { moduleMap } from '../props/module-map.static'

export async function addModuleToMap(this: Container, moduleClass: ClassType) {
  if (moduleMap.has(moduleClass)) {
    return;
  }

  const moduleMeta = getModuleMeta(moduleClass);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleClass);
  }

  const module = new Container();

  await module._addExportServicesAsProviders(moduleMeta.exports);
  await module.addProviders(moduleMeta.providers);
  await module.addModules(moduleMeta.imports);

  moduleMap.set(moduleClass, module);
}