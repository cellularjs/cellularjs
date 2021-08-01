import { Container, Token  } from '../../';

export function resolveWithRefModule<T>(
  this: Container,
  token: Token,
  refModule: Container,
  global?: Container,
): Promise<T> {
  this._refModule = refModule;

  return this.resolve<T>(token, { global });
}