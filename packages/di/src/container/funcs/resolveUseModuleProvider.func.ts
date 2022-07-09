import { Container, ResolveOptions } from '../..';
import { ClassifiedProvider, moduleMap } from '../../internal';

export function resolveUseModuleProvider<T>(
  this: Container,
  provider: ClassifiedProvider,
  options: ResolveOptions,
): Promise<T> {
  const moduleFromMap = moduleMap.get(provider.useModule);

  if (!this._extModules.has(provider.useModule)) {
    return moduleFromMap.resolve(provider.token, options);
  }

  const extModule = this._extModules.get(provider.useModule);
  return moduleFromMap.resolve(provider.token, { ...options, extModule });
}
