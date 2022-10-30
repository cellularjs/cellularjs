import { Container, ModuleRef, ModuleWithListener } from '../..';
import { Errors, ClassType, moduleMap } from '../../internal';
import { getModuleMeta } from '../../utils';
import { addExports } from './add-exports.func';

/**
 * @since 0.1.0
 */
export async function addModuleToMap(this: Container, moduleClass: ClassType) {
  if (moduleMap.has(moduleClass)) {
    return;
  }

  const moduleMeta = getModuleMeta(moduleClass);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleClass);
  }

  const newModule = new Container(moduleClass);

  moduleMap.set(moduleClass, newModule);

  await newModule.addProviders(moduleMeta.providers);
  await addExports.call(newModule, moduleMeta.exports);
  await newModule.addModules(moduleMeta.imports);

  await finalizeInitModule(moduleClass, newModule);
}

async function finalizeInitModule(
  moduleClass: ClassType,
  newModule: Container,
) {
  const tempContainer = new Container();

  await tempContainer.addProviders([
    { token: moduleClass, useClass: moduleClass },
    { token: ModuleRef, useValue: newModule },
  ]);

  const moduleInstance = await tempContainer.resolve<ModuleWithListener>(
    moduleClass,
    { extModule: newModule },
  );

  moduleInstance.onInit && (await moduleInstance.onInit());
}
