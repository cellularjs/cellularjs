import { Container, AdjustedProvider, ResolveOptions } from '../../'
import { PermanentCycle } from "../../consts/cycle.const"

export async function resolveClassProvider(
  this: Container,
  provider: AdjustedProvider<any>,
  options: ResolveOptions,
) {
  if (this._resolvedValues.has(provider.token)) {
    return this._resolvedValues.get(provider.token);
  }

  const args = await this._resolveConstructorArgs(provider.useClass, options)
  const resolvedValue = Reflect.construct(provider.useClass, args);

  if (provider.cycle === PermanentCycle) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  return resolvedValue;
}
