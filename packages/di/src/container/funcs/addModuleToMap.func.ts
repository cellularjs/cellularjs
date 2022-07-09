import { Container, ModuleRef, ModuleWithListener } from '../../';
import { Errors, ClassType, moduleMap } from '../../internal';
import { getModuleMeta } from '../../utils';

export async function addModuleToMap(this: Container, moduleClass: ClassType) {
  if (moduleMap.has(moduleClass)) {
    return;
  }

  const moduleMeta = getModuleMeta(moduleClass);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleClass);
  }

  const newModule = new Container();

  moduleMap.set(moduleClass, newModule);

  await newModule.addProviders(moduleMeta.providers);
  await newModule._addExports(moduleMeta.exports);
  await newModule.addModules(moduleMeta.imports);

  await createModuleListener(moduleClass, newModule);
}

// TODO: rename
async function createModuleListener(
  moduleClass: ClassType,
  newModule: Container,
) {
  const tempContainer = new Container();

  await tempContainer.addProviders([
    { token: moduleClass, useClass: moduleClass },
    { token: ModuleRef, useValue: newModule },
  ]);

  const moduleListener = await tempContainer.resolve<ModuleWithListener>(
    moduleClass,
    {
      extModule: newModule,
    },
  );

  if (moduleListener.onInit) {
    await moduleListener.onInit();
  }
}
