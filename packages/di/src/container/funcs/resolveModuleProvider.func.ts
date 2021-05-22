import { Container } from '../../'
import { AdjustedProvider } from '../../types'
import { moduleMap } from '../props/module-map.static'

export function resolveModuleProvider<T>(this: Container, provider: AdjustedProvider<any>): Promise<T> {
  const moduleFromMap = moduleMap.get(provider.useModule);

  if (this._extModules.has(provider.useModule)) {
    const extModule = this._extModules.get(provider.useModule);
    return moduleFromMap._resolveWithExtModule(provider.token, extModule);
  }

  return moduleFromMap.resolve(provider.token);
}
