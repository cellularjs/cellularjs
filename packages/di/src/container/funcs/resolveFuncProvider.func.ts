import { Container } from '../../';
import { PermanentCycle } from "../../consts/cycle.const"
import { AdjustedProvider } from '../../types'

export function resolveFuncProvider(this: Container, provider: AdjustedProvider<any>) {
  if (this._resolvedValues.has(provider.token)) {
    return this._resolvedValues.get(provider.token);
  }

  const useFuncArgs = this._resolveUseFuncArgs(provider.deps);
  const resolvedValue = provider.useFunc(...useFuncArgs);

  if (provider.cycle === PermanentCycle) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  return resolvedValue;
}
