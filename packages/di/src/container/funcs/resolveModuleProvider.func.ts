import { Container } from '../../'
import { AdjustedProvider } from '../../type'
import { moduleMap } from '../props/module-map.static'

export function resolveModuleProvider(this: Container, provider: AdjustedProvider<any>) {
  const moduleFromMap = moduleMap.get(provider.useModule);

  if (this._extModules.has(provider.useModule)) {
    const extModule = this._extModules.get(provider.useModule);
    return moduleFromMap._resolveWithExtModule(provider.token, extModule);
  }

  return moduleFromMap.resolve(provider.token);
}
