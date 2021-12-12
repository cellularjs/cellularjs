import { getModuleMeta } from '../../utils';
import { ClassType, ExportableCnf } from '../../types';
import { Container } from '../../';

export async function addExportServicesAsProviders(this: Container, exports: ExportableCnf[] = []): Promise<void> {
  for (let i = 0; i < exports.length; i++) {
    const provider = exports[i];
    // TODO: prevent complicate nested ExtendModule
    // if ((provider as ExtModuleMeta).extModule) throw;

    // ignore module class
    if (getModuleMeta(provider as ClassType)) continue;

    await this.addProvider(provider as ClassType);
  }
}
