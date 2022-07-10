import { Container } from '../../';
import { Errors } from '../../consts/error.const';
import {
  ClassType,
  ImportableCnf,
  ExportableCnf,
  ExtModuleMeta,
} from '../../types';
import { getModuleMeta } from '../../utils';

export async function addModule(
  this: Container,
  moduleCnf: ImportableCnf | ExportableCnf,
): Promise<void> {
  if ((moduleCnf as ExtModuleMeta).extModule) {
    return this._addExtModule(moduleCnf as ExtModuleMeta);
  }

  const moduleMeta = getModuleMeta(moduleCnf as ClassType);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleCnf as ClassType);
  }

  await this._addModuleExports(moduleCnf as ClassType, moduleMeta.exports);
  await this._addModuleToMap(moduleCnf as ClassType);
}
