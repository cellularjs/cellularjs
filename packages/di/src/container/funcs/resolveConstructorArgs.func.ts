import { Container, ResolveOptions } from '../../';
import { ClassType } from '../../internal';
import { getParamTypes, getForwardRefCallback } from '../../utils';

export async function resolveConstructorArgs(
  this: Container,
  target: ClassType,
  options: ResolveOptions,
): Promise<any[]> {
  const args = getParamTypes(target).map((type, index) => {
    const forwardRefCallback = getForwardRefCallback(target, index);
    const paramType = forwardRefCallback ? forwardRefCallback() : type;

    return this.resolve(paramType, options);
  });

  return Promise.all(args);
}
