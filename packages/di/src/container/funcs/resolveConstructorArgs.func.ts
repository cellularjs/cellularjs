import { Container, ResolveOptions } from '../../';
import { getParamTypes, getToken } from "../../utils";

export async function resolveConstructorArgs(
  this: Container,
  target,
  options: ResolveOptions,
): Promise<any[]> {
  const args = getParamTypes(target).map((param, i) => {
    const paramType = getToken(target, i) || param;
    return this.resolve(paramType, options);
  });

  return Promise.all(args);
}
