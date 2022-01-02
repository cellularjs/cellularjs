import { Container, ResolveOptions } from '../../';
import { ClassifiedProvider } from '../../internal';
import { PermanentCycle } from '../../consts/cycle.const';

export async function resolveUseFuncProvider<T>(
  this: Container,
  provider: ClassifiedProvider,
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
