import { Container } from '../../';
import { Token } from "../../types";

export function resolveWithRefModule<T>(this: Container, token: Token, refModule: Container): T {
  this._refModule = refModule;
  const resolvedValue = this.resolve<T>(token);

  return resolvedValue;
}