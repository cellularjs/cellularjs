import { Container } from '..';
import { Provider } from '../internal';

export function useValueResolver(
  _: Container,
  provider: Provider<{ useValue: any }>,
) {
  return provider.meta.useValue;
}
