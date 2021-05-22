import { Errors } from "../../";
import { Token } from "../../types";
import { Container, globalContainer } from "../"

export async function resolve<T>(this: Container, token: Token): Promise<T> {
  if (this._extModule && this._extModule.has(token)) {
    return this._extModule._resolveWithRefModule(token, this);
  }

  const provider = this._providers.get(token);
  
  if (!provider) return tryAgain.bind(this)(token);

  return this[provider.resolver].call(this, provider);
}

function tryAgain<T>(this: Container, token) {
  if (this._refModule && this._refModule.has(token)) {
    return this._refModule.resolve<T>(token);
  }
 
  if (globalContainer.has(token)) {
    return globalContainer.resolve<T>(token);
  }

  throw Errors.NoProviderForToken(token);
}