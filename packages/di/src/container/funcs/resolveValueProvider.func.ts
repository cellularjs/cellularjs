import { AdjustedProvider } from '../../type'

export function resolveValueProvider(provider: AdjustedProvider<any>) {
  return provider.useValue;
}
