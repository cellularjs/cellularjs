import { Container, DiError, DiErrorCode } from '../../';
import { ClassType, InnerResolveOptions } from '../../internal';
import {
  getParamTypes,
  getForwardRefCallback,
  getOptionalData,
} from '../../utils';

export async function resolveConstructorArgs(
  this: Container,
  target: ClassType,
  options: InnerResolveOptions,
): Promise<any[]> {
  const resolvedValues = [];
  const paramTypes = getParamTypes(target);

  for (let i = 0; i < paramTypes.length; i++) {
    resolvedValues.push(
      await resolveArg.call(this, target, options, paramTypes[i], i),
    );
  }

  return resolvedValues;
}

async function resolveArg(
  this: Container,
  target: ClassType,
  options: InnerResolveOptions,
  type,
  index,
) {
  const forwardRefCallback = getForwardRefCallback(target, index);
  const paramType = forwardRefCallback ? forwardRefCallback() : type;

  try {
    return await this._innerResolve(paramType, options);
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
