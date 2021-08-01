import { Errors, Container, Token, ResolveOptions } from "../../";

export function resolve<T>(
  this: Container,
  token: Token,
  options: ResolveOptions = {},
): Promise<T> {
  // B1: extModule has highest priority, so check it first. 
  const { extModule, global } = options;
  if (extModule?.has(token)) {
    return extModule._resolveWithRefModule<T>(token, this, global);
  }

  // B2: if provider for this token exists in this container,
  // use normalized resolver to resolve it.
  const provider = this._providers.get(token);
  if (provider) {
    return this[provider.resolver].call(this, provider, options);
  }

  // B3: provider for this token exists in parent module.
  if (this._refModule?.has(token)) {
    return this._refModule.resolve<T>(token, options);
  }

  // B4: provider for this token exists in global module.
  if (global?.has(token)) {
    return global.resolve(token);
  }

  // B5:
  throw Errors.NoProviderForToken(token);
}