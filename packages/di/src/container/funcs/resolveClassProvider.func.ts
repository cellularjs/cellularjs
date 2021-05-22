import { Container } from '../../'
import { PermanentCycle } from "../../consts/cycle.const"
import { AdjustedProvider } from '../../types'

export async function resolveClassProvider(this: Container, provider: AdjustedProvider<any>) {
  if (this._resolvedValues.has(provider.token)) {
    return this._resolvedValues.get(provider.token);
  }

  const args = await this._resolveConstructorArgs(provider.useClass)
  const resolvedValue = Reflect.construct(provider.useClass, args);

  if (provider.cycle === PermanentCycle) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  return resolvedValue;
}
