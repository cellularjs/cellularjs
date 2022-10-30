import { Container } from '../..';
import { Errors } from '../../consts/error.const';
import {
  ClassType,
  ImportableCnf,
  ExportableCnf,
  ExtModuleMeta,
} from '../../types';
import { getModuleMeta } from '../../utils';
import { addExtModule } from './add-ext-module.func';
import { addModuleExports } from './add-module-exports.func';
import { addModuleToMap } from './add-module-to-map.func';

/**
 * @since 0.1.0
 */
export async function addModule(
  this: Container,
  moduleCnf: ImportableCnf | ExportableCnf,
): Promise<void> {
  if ((moduleCnf as ExtModuleMeta).extModule) {
    return addExtModule.call(this, moduleCnf as ExtModuleMeta);
  }

  const moduleMeta = getModuleMeta(moduleCnf as ClassType);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleCnf as ClassType);
  }

  await addModuleExports.call(this, moduleCnf as ClassType, moduleMeta.exports);
  await addModuleToMap.call(this, moduleCnf as ClassType);
}
