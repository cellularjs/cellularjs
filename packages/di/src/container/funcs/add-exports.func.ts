import { getModuleMeta } from '../../utils';
import { ClassType, ExportableCnf } from '../../types';
import { Container, ExtModuleMeta } from '../..';
import { addExportClassAsProvider } from './add-export-class-as-provider.func';
import { addExtModule } from './add-ext-module.func';

/**
 * Add service classes from ExportableCnf[] into container as providers.
 *
 * @since 0.2.0
 */
export async function addExports(
  this: Container,
  exports: ExportableCnf[] = [],
): Promise<void> {
  for (let i = 0; i < exports.length; i++) {
    const exportCnf = exports[i];

    if ((<ExtModuleMeta>exportCnf).extModule) {
      await addExtModule.call(this, <ExtModuleMeta>exportCnf);
      continue;
    }

    if (getModuleMeta(<ClassType>exportCnf)) {
      await this.addModule(exportCnf);
      continue;
    }

    await addExportClassAsProvider.call(this, exportCnf);
  }
}
