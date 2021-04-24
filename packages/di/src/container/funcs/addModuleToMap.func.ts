import { Errors, ClassType, Container } from '../../'
import { getModuleMeta } from "../../utils";
import { moduleMap } from '../props/module-map.static'

export function addModuleToMap(this: Container, moduleClass: ClassType<any>): void {
  if (moduleMap.has(moduleClass)) {
    return;
  }

  const moduleMeta = getModuleMeta(moduleClass);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleClass);
  }

  const module = new Container();

  module._addExportServicesAsProviders(moduleMeta.exports);
  module.addProviders(moduleMeta.providers);
  module.addModules(moduleMeta.imports);

  moduleMap.set(moduleClass, module);
}