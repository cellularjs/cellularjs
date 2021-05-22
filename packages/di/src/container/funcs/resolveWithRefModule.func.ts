import { Container } from '../../';
import { Token } from "../../types";

export function resolveWithRefModule<T>(this: Container, token: Token, refModule: Container): Promise<T> {
  this._refModule = refModule;

  return this.resolve<T>(token);
}