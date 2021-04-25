import { Errors, Container } from "../../";
import { Token } from "../../types";

export function resolve<T>(this: Container, token: Token): T {
  if (this._extModule && this._extModule.has(token)) {
    return this._extModule._resolveWithRefModule(token, this);
  }

  const provider = this._providers.get(token);
  if (!provider) {
    const shouldThrow = !this._refModule || !this._refModule.has(token);
    if (shouldThrow) throw Errors.NoProviderForToken(token);

    return this._refModule.resolve(token);
  }

  return this[provider.resolver](provider);
}