import { Container } from '../../';
import { ClassType, ExportableCnf, ExtModuleMeta } from "../../types";
import { getModuleMeta } from "../../utils";

export function addModuleExports(this: Container, moduleClass: ClassType<any>, exports: ExportableCnf[] = []) {
  exports.forEach((exportCnf: ExportableCnf) => {
    const moduleMeta = getModuleMeta(exportCnf);
    if (moduleMeta || (exportCnf as ExtModuleMeta).extModule) {
      this.addModule(exportCnf);
      return;
    }

    this.addProvider({
      token: exportCnf as ClassType<any>,
      useModule: moduleClass,
    });
  });
}
