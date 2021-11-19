import { Container } from '../../';
import { Errors } from '../../consts/error.const';
import { ClassType, ImportableCnf, ExportableCnf, ExtModuleMeta } from '../../types';
import { getModuleMeta } from '../../utils';

export function addModule(this: Container, moduleCnf: ImportableCnf | ExportableCnf): void {
  if ((moduleCnf as ExtModuleMeta).extModule) {
    this._addExtModule(moduleCnf as ExtModuleMeta);
    return;
  }

  const moduleMeta = getModuleMeta(moduleCnf as ClassType);
  if (!moduleMeta) {
    throw Errors.InvalidModuleClass(moduleCnf);
  }

  this._addModuleExports(moduleCnf as ClassType, moduleMeta.exports);
  this._addModuleToMap(moduleCnf as ClassType);
}