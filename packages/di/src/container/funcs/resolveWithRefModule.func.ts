import { Container } from '../../';
import { Token } from "../../type";

export function resolveWithRefModule<T>(this: Container, token: Token, refModule: Container): T {
  this._refModule = refModule;
  const resolvedValue = this.resolve<T>(token);

  return resolvedValue;
}