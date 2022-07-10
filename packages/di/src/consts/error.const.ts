import { ResolveTrace, Token, ClassType } from '../internal';
import { Tracer } from '../tracer';
import { getVarName } from '../utils';

export enum DiErrorCode {
  NoProviderForToken = 'NO_PROVIDER_FOR_TOKEN',
  DuplicateToken = 'DUPLICATE_TOKEN',
  InvalidModuleClass = 'INVALID_MODULE_CLASS',
}

export class DiError extends Error {
  constructor(message: string, public code: DiErrorCode) {
    super(message);
  }
}

export const Errors = {
  DuplicateToken: (token: Token) =>
    new DiError(
      `Duplicate token ${getVarName(token)}`,
      DiErrorCode.DuplicateToken,
    ),

  InvalidModuleClass: (moduleClass: ClassType) =>
    new DiError(
      `${getVarName(
        moduleClass,
      )} is not a valid module. A valid module must be decorated by @Module annotation.`,
      DiErrorCode.InvalidModuleClass,
    ),

  NoProviderForToken: (token: Token, tracer: Tracer<ResolveTrace>) => {
    const traces = tracer.getTraces();
    let errorMsg = `There is no provider for ${getVarName(token)}`;

    const depPaths = traces.map(
      (trace, idx) =>
        `${getVarName(trace.token)}${
          trace.module && idx !== traces.length - 1
            ? `(${getVarName(trace.module)})`
            : ''
        }`,
    );

    if (depPaths.length > 1) {
      errorMsg += `\n    Dependency paths: ${depPaths.join(' => ')}`;
    }

    return new DiError(errorMsg, DiErrorCode.NoProviderForToken);
  },
};
