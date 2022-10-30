import { ResolveOptions, Provider, Token } from '../internal';
import { Container } from '../container';

export function useExistingResolver(
  container: Container,
  provider: Provider<{ useExisting: Token }>,
  options: ResolveOptions,
) {
  return container.resolve(provider.meta.useExisting, options);
}
