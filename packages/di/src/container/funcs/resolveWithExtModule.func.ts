import { Container } from '../../';
import { Token } from "../../types";

export async function resolveWithExtModule<T>(this: Container, token: Token, extModule: Container): Promise<T> {
  this._extModule = extModule;
  const resolvedValue = await this.resolve<T>(token);
  delete this._extModule;

  return resolvedValue;
}