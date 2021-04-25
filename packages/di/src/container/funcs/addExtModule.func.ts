import { Container } from '../../';
import { ExtModuleMeta, ClassType } from "../../types";
import { getModuleMeta } from "../../utils";

export function addExtModule(this: Container, extModuleMeta: ExtModuleMeta) {
  this.addModule(extModuleMeta.extModule);

  const extModule = new Container();
  extModule.addProviders(extModuleMeta.providers);

  (extModuleMeta.exports || []).forEach(exportCnf => {
    const moduleMeta = getModuleMeta(exportCnf);
    if (moduleMeta) {
      this.addModule(exportCnf);
      return;
    }

    this.addProvider({
      token: exportCnf,
      useModule: extModuleMeta.extModule,
    });

    extModule.addProvider(exportCnf as ClassType<any>);
  });

  extModule.addModules(extModuleMeta.imports);

  this._extModules.set(extModuleMeta.extModule, extModule);
}