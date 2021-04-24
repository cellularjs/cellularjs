import { Container } from '../../';
import { Token } from "../../type";

export function resolveWithExtModule<T>(this: Container, token: Token, extModule: Container): T {
  this._extModule = extModule;
  const resolvedValue = this.resolve<T>(token);
  delete this._extModule;

  return resolvedValue;
}