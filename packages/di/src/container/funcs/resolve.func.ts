import { Errors, Container } from "../../";
import { Token } from "../../types";
import { moduleMap } from "../props/module-map.static"
import { GlobalModule } from "../../consts/global-module.const"

export function resolve<T>(this: Container, token: Token): T {
  if (this._extModule && this._extModule.has(token)) {
    return this._extModule._resolveWithRefModule(token, this);
  }

  const provider = this._providers.get(token);
  
  if (!provider) return tryAgain.bind(this)(token);

  return this[provider.resolver](provider);
}

function tryAgain<T>(this: Container, token) {
  if (this._refModule && this._refModule.has(token)) {
    return this._refModule.resolve<T>(token);
  }

  const globalModule = moduleMap.get(GlobalModule);
  if (globalModule.has(token)) {
    return globalModule.resolve<T>(token);
  }

  throw Errors.NoProviderForToken(token);
}