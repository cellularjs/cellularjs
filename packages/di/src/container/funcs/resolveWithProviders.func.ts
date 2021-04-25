import { Container } from '../../';
import { GenericProvider, Token } from "../../types";

export function resolveWithProviders<T>(this: Container, token: Token, providers: GenericProvider<any>[]): T {
  const extModule = new Container();
  extModule.addProviders(providers);

  return this._resolveWithExtModule<T>(token, extModule);
}