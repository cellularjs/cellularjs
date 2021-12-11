import { Container, ResolveOptions, DiError, DiErrorCode } from '../../';
import { ClassType } from '../../internal';
import { getParamTypes, getForwardRefCallback, getOptionalData } from '../../utils';

export async function resolveConstructorArgs(
  this: Container,
  target: ClassType,
  options: ResolveOptions,
): Promise<any[]> {
  const resolvedValues = []
  const paramTypes = getParamTypes(target);

  for (let i = 0; i < paramTypes.length; i++) {
    resolvedValues.push(
      await resolveArg(this, target, options, paramTypes[i], i),
    );
  }

  return resolvedValues;
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