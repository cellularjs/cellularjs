import { Container, AdjustedProvider, ResolveOptions } from '../../';
import { PermanentCycle } from "../../consts/cycle.const"

export async function resolveFuncProvider<T>(
  this: Container,
  provider: AdjustedProvider<any>,
  options: ResolveOptions,
): Promise<T> {
  if (this._resolvedValues.has(provider.token)) {
    return this._resolvedValues.get(provider.token);
  }

  const useFuncArgs = await this._resolveUseFuncArgs(provider.deps, options);
  const resolvedValue = await provider.useFunc(...useFuncArgs);

  if (provider.cycle === PermanentCycle) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  return resolvedValue;
}
