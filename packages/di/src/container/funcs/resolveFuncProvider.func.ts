import { Container } from '../../';
import { PermanentCycle } from "../../consts/cycle.const"
import { AdjustedProvider } from '../../types'

export async function resolveFuncProvider<T>(this: Container, provider: AdjustedProvider<any>): Promise<T> {
  if (this._resolvedValues.has(provider.token)) {
    return this._resolvedValues.get(provider.token);
  }

  const useFuncArgs = await this._resolveUseFuncArgs(provider.deps);
  const resolvedValue = await provider.useFunc(...useFuncArgs);

  if (provider.cycle === PermanentCycle) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  return resolvedValue;
}
