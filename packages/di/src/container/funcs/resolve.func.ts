import { Container, Token, ResolveOptions } from '../../';
import {
  Errors,
  ResolveTrace,
  DiResolvers,
  InnerResolveOptions,
} from '../../internal';
import { Tracer } from '../../tracer';

export async function resolve<T>(
  this: Container,
  token: Token,
  rawOptions: ResolveOptions = {},
): Promise<T> {
  const options: InnerResolveOptions = {
    ...rawOptions,
    tracer: new Tracer<ResolveTrace>(),
  };

  return this._innerResolve(token, options);
}

export async function innerResolve<T>(
  this: Container,
  token: Token,
  options: InnerResolveOptions,
): Promise<T> {
  const { extModule, global, tracer } = options;
  const traceIdx = tracer.log({ module: this.getModuleClass(), token });

  // B1: extModule has highest priority, so check it first.
  if (extModule?.has(token)) {
    const resolvedValue = await extModule._resolveWithParentModule<T>(
      token,
      this,
      global,
    );
    tracer.clear(traceIdx);

    return resolvedValue;
  }

  // B2: if provider for this token exists in this container,
  // use normalized resolver to resolve it.
  const provider = this._providers.get(token);
  if (provider) {
    const isUseModule = provider.resolver === DiResolvers.useModuleResolver;

    isUseModule && tracer.clear(traceIdx);
    const resolvedValue = await this[provider.resolver].call(
      this,
      provider,
      options,
    );
    !isUseModule && tracer.clear(traceIdx);

    return resolvedValue;
  }

  // B3: provider for this token exists in parent module.
  if (this._parentModule?.has(token)) {
    const resolvedValue = await this._parentModule._innerResolve<T>(
      token,
      options,
    );
    tracer.clear(traceIdx);
    return resolvedValue;
  }

  // B4: provider for this token exists in global module.
  if (global?.has(token)) {
    return global._innerResolve(token, { tracer });
  }

  // B5:
  throw Errors.NoProviderForToken(token, tracer);
}
