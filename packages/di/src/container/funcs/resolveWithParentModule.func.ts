import { Container, Token } from '../..';

export function resolveWithParentModule<T>(
  this: Container,
  token: Token,
  parentModule: Container,
  global?: Container,
): Promise<T> {
  this._parentModule = parentModule;

  return this.resolve<T>(token, { global });
}
