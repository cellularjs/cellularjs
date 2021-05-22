import { Container } from '../../';
import { getParamTypes, getToken } from "../../utils";

export async function resolveConstructorArgs(this: Container, target): Promise<any[]> {
  const args = [];
  const params = getParamTypes(target);

  for (let i = 0; i < params.length; i++) {
    const paramType = getToken(target, i) || params[i];
    args.push(this.resolve(paramType));
  }

  return Promise.all(args);
}
