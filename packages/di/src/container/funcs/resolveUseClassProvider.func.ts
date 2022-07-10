import { Container } from '../../';
import { ClassifiedProvider, InnerResolveOptions } from '../../internal';
import { PermanentCycle } from '../../consts/cycle.const';

export async function resolveUseClassProvider(
  this: Container,
  provider: ClassifiedProvider,
  options: InnerResolveOptions,
) {
  if (this._resolvedValues.has(provider.token)) {
    return this._resolvedValues.get(provider.token);
  }

  const args = await this._resolveConstructorArgs(provider.useClass, options);
  const resolvedValue = Reflect.construct(provider.useClass, args);

  if (provider.cycle === PermanentCycle) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  return resolvedValue;
}
