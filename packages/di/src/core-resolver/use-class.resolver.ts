import { Provider, ResolveOptions } from '../internal';
import { Container } from '../container';
import { DiError, DiErrorCode } from '..';
import { ClassType } from '../internal';
import {
  getParamTypes,
  getForwardRefCallback,
  getOptionalData,
} from '../utils';

export async function useClassResolver(
  container: Container,
  provider: Provider<{ useClass: ClassType }>,
  options: ResolveOptions,
) {
  const resolvedValues = [];
  const paramTypes = getParamTypes(provider.meta.useClass);

  for (let i = 0; i < paramTypes.length; i++) {
    resolvedValues.push(
      await resolveArg(
        container,
        provider.meta.useClass,
        options,
        paramTypes[i],
        i,
      ),
    );
  }

  return new provider.meta.useClass(...resolvedValues);
}

async function resolveArg(
  container: Container,
  target: ClassType,
  options: ResolveOptions,
  type,
  index,
) {
  const forwardRefCallback = getForwardRefCallback(target, index);
  const paramType = forwardRefCallback ? forwardRefCallback() : type;

  try {
    return await container.resolve(paramType, options);
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
