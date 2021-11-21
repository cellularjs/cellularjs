import { Container, ResolveOptions } from '../../';
import { DiError, DiErrorCode } from '../../../dist';
import { ClassType } from '../../internal';
import { getParamTypes, getForwardRefCallback, getOptionalData } from '../../utils';

export async function resolveConstructorArgs(
  this: Container,
  target: ClassType,
  options: ResolveOptions,
): Promise<any[]> {
  const args = getParamTypes(target).map(
    (type, index) => resolveArg(this, target, options, type, index),
  );

  return Promise.all(args);
}

async function resolveArg(
  self: Container,
  target: ClassType,
  options: ResolveOptions,
  type,
  index,
) {
  const forwardRefCallback = getForwardRefCallback(target, index);
  const paramType = forwardRefCallback ? forwardRefCallback() : type;

  try {
    return await self.resolve(paramType, options);

  } catch (err) {
    if (type === undefined) {
      throw err;
    }

    if ((<DiError>err).code !== DiErrorCode.NoProviderForToken) {
      throw err;
    }

    if (!getOptionalData(target, index)) {
      throw err;
    }

    return undefined;
  }
}