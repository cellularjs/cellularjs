import { Container } from '..';
import { ClassType, ResolveOptions, moduleMap, Provider } from '../internal';

export function useModuleResolver<T>(
  container: Container,
  provider: Provider<{ useModule: ClassType }>,
  options: ResolveOptions,
): Promise<T> {
  const moduleFromMap = moduleMap.get(provider.meta.useModule);

  if (!container.hasExtModule(provider.meta.useModule)) {
    return moduleFromMap.resolve(provider.token, options);
  }

  const extModule = container.getExtModule(provider.meta.useModule);
  return moduleFromMap.resolve(provider.token, { ...options, extModule });
}
