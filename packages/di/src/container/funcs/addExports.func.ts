import { getModuleMeta } from '../../utils';
import { ClassType, ExportableCnf } from '../../types';
import { Container, ExtModuleMeta } from '../..';
import { addExportClassAsProvider } from './addExportClassAsProvider.func';

export async function addExports(
  this: Container,
  exports: ExportableCnf[] = [],
): Promise<void> {
  for (let i = 0; i < exports.length; i++) {
    const exportCnf = exports[i];

    if ((<ExtModuleMeta>exportCnf).extModule) {
      await this._addExtModule(<ExtModuleMeta>exportCnf);
      continue;
    }

    if (getModuleMeta(<ClassType>exportCnf)) {
      await this.addModule(exportCnf);
      continue;
    }

    await addExportClassAsProvider.call(this, exportCnf);
  }
}
