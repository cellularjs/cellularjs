import { Container } from '../../';
import { ClassifiedProvider, InnerResolveOptions } from '../../internal';

export function resolveUseExistingProvider(
  this: Container,
  provider: ClassifiedProvider,
  options: InnerResolveOptions,
) {
  return this._innerResolve(provider.useExisting, options);
}
