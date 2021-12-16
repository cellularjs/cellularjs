import { getModuleMeta } from '../../utils';
import { ClassType, ExportableCnf } from '../../types';
import { Container, ExtModuleMeta } from '../../';

export async function addExportServicesAsProviders(this: Container, exports: ExportableCnf[] = []): Promise<void> {
  for (let i = 0; i < exports.length; i++) {
    const exportCnf = exports[i];

    // TODO: add test for better TEST COVERAGE.
    if ((<ExtModuleMeta>exportCnf).extModule) {
      await this._addExtModule(<ExtModuleMeta>exportCnf);
      continue;
    }

    // TODO: add test for better TEST COVERAGE.
    if (getModuleMeta(<ClassType>exportCnf)) {
      await this.addModule(exportCnf);
      continue;
    }

    await this.addProvider(<ClassType>exportCnf);
  }
}
