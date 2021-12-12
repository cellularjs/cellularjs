import { Container, ModuleRef, ModuleWithListener } from '../../';
import { Errors, ClassType } from '../../internal';
import { getModuleMeta } from '../../utils';
import { moduleMap } from '../props/module-map.static';

export async function addModuleToMap(this: Container, moduleClass: ClassType) {
  if (moduleMap.has(moduleClass)) {
    return;
  }

  const moduleMeta = getModuleMeta(moduleClass);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleClass);
  }

  const newModule = new Container();

  await newModule._addExportServicesAsProviders(moduleMeta.exports);
  await newModule.addProviders(moduleMeta.providers);
  await newModule.addModules(moduleMeta.imports);

  moduleMap.set(moduleClass, newModule);

  await createModuleListener(moduleClass, newModule);
}

// TODO: rename
async function createModuleListener(moduleClass, newModule: Container) {
  const tempContainer = new Container();

  await tempContainer.addProviders([
    { token: moduleClass, useClass: moduleClass },
    { token: ModuleRef, useValue: newModule },
  ]);

  const moduleListener = await tempContainer.resolve<ModuleWithListener>(moduleClass, {
    extModule: newModule,
  });

  if (moduleListener.onInit) {
    await moduleListener.onInit();
  }
}