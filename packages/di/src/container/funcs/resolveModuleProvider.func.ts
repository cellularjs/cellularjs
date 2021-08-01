import { Container, AdjustedProvider, ResolveOptions } from '../../'
import { moduleMap } from '../props/module-map.static'

export function resolveModuleProvider<T>(
  this: Container,
  provider: AdjustedProvider<any>,
  options: ResolveOptions,
): Promise<T> {
  const moduleFromMap = moduleMap.get(provider.useModule);

  if (!this._extModules.has(provider.useModule)) {
    return moduleFromMap.resolve(provider.token, options);
  }

  const extModule = this._extModules.get(provider.useModule);
  return moduleFromMap.resolve(
    provider.token,
    { ...options, extModule },
  );
}
