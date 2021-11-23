import { Container, ResolveOptions } from '../../';
import { ClassifiedProvider } from '../../internal';

export function resolveUseExistingProvider(
  this: Container,
  provider: ClassifiedProvider,
  options: ResolveOptions,
) {
  return this.resolve(provider.useExisting, options);
}
