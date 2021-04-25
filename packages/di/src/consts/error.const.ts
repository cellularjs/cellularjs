import { getVarName } from "../utils";

export enum DiErrorCode {
  NoProviderForToken = 'DI_NO_PROVIDER_FOR_TOKEN',
  DuplicateToken = 'DI_DUPLICATE_TOKEN',
  InvalidModuleClass = 'DI_INVALID_MODULE_CLASS',
}

export class DiError extends Error {
  constructor(
    message: string,
    public code: DiErrorCode,
  ) {
    super(message);
  }
}

export const Errors= {
  DuplicateToken: token => new DiError(
    `Duplicate token "${getVarName(token)}"`,
    DiErrorCode.DuplicateToken,
  ),

  InvalidModuleClass: moduleClass => new DiError(
    `"${getVarName(moduleClass)}" is not a valid module. A valid module must be decorated by @Module annotation.`,
    DiErrorCode.InvalidModuleClass,
  ),

  NoProviderForToken: token => new DiError(
    `There is no provider for "${getVarName(token)}"`,
    DiErrorCode.NoProviderForToken,
  ),
};
