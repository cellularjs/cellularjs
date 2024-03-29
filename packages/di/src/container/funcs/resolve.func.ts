import { Container, Token, ResolveOptions } from '../../';
import {
  Errors,
  ResolveTrace,
  Provider,
  getGlobalModule,
  _TRACER_KEY,
  _PARENT_MODULE_KEY,
} from '../../internal';
import { Tracer } from '../../tracer';
import { DiCycle } from '../../consts/cycle.const';

export async function resolve<T = any>(
  this: Container,
  token: Token,
  options: ResolveOptions = {},
): Promise<T> {
  if (this._resolvedValues.has(token)) {
    return this._resolvedValues.get(token);
  }

  if (!options[_TRACER_KEY]) options[_TRACER_KEY] = new Tracer<ResolveTrace>();

  const { extModule } = options;
  const parentModule = options[_PARENT_MODULE_KEY];
  const tracer = options[_TRACER_KEY];
  const traceIdx = tracer.log({ module: this.moduleClass, token });

  // B1: extModule has highest priority, so check it first.
  if (extModule?.has(token))
    return await extModule.resolve<T>(token, {
      [_PARENT_MODULE_KEY]: this,
      [_TRACER_KEY]: tracer,
    });

  // B2: if provider for this token exists in this container,
  // use normalized resolver to resolve it.
  const provider = this._providers.get(token);
  if (provider) return resolveProvider.call(this, traceIdx, provider, options);

  // B3: provider for this token exists in parent module.
  if (parentModule?.has(token))
    return await parentModule.resolve<T>(token, options);

  // B4: provider for this token exists in global module.
  const globalModule = getGlobalModule();
  if (globalModule.has(token)) {
    return globalModule.resolve(token, { [_TRACER_KEY]: tracer });
  }

  // B5:
  throw Errors.NoProviderForToken(token, tracer);
}

async function resolveProvider(
  this: Container,
  traceIdx: number,
  provider: Provider,
  options: ResolveOptions,
) {
  const tracer = options[_TRACER_KEY];
  const resolvedValue = await provider.resolver(this, provider, options);

  if (provider.cycle === DiCycle.permanent) {
    this._resolvedValues.set(provider.token, resolvedValue);
  }

  tracer.clear(traceIdx);

  return resolvedValue;
}
