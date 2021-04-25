import { getModuleMeta } from '../../utils'
import { ClassType, ExportableCnf } from "../../types";
import { Container } from '../../'

export function addExportServicesAsProviders<T>(this: Container, exports: ExportableCnf[] = []): void {
  exports.forEach((provider: ExportableCnf) => {
    // TODO: prevent complicate nested ExtendModule
    // if ((provider as ExtModuleMeta).extModule) throw;

    // ignore module class
    if (getModuleMeta(provider)) return;

    this.addProvider(provider as ClassType<any>);
  });
}
