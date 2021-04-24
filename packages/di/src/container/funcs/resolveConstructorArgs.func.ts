import { Container } from '../../';
import { getParamTypes, getToken } from "../../utils";

export function resolveConstructorArgs(this: Container, target): any[] {
  return getParamTypes(target).map((type, index) => {
    const paramType = getToken(target, index) || type;
    return this.resolve(paramType);
  });
}
