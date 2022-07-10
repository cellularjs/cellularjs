import { Container } from '../..';
import {
  ClassifiedProvider,
  InnerResolveOptions,
  moduleMap,
} from '../../internal';

export function resolveUseModuleProvider<T>(
  this: Container,
  provider: ClassifiedProvider,
  options: InnerResolveOptions,
): Promise<T> {
  const moduleFromMap = moduleMap.get(provider.useModule);

  if (!this._extModules.has(provider.useModule)) {
    return moduleFromMap._innerResolve(provider.token, options);
  }

  const extModule = this._extModules.get(provider.useModule);
  return moduleFromMap._innerResolve(provider.token, { ...options, extModule });
}
