import { AdjustedProvider } from '../../types'

export function resolveValueProvider(provider: AdjustedProvider<any>) {
  return provider.useValue;
}
