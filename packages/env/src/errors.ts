export enum EnvErrorCode {
  UseEnvFuncBeforeImport = 'USE_ENV_FUNC_BEFORE_IMPORT',
  ImportModuleIncorectly = 'IMPORT_MODULE_INCORRECTLY',
  InvokeConfigMultipleTimes = 'INVOKE_CONFIG_MULTIPLE_TIMES',
}

export class EnvError extends Error {
  constructor(message: string, public code: EnvErrorCode) {
    super(message);
  }
}

export const Errors = {
  UseEnvFuncBeforeImport: () =>
    new EnvError(
      `You need to import EnvModule with "EnvModule.config" before using env() function`,
      EnvErrorCode.UseEnvFuncBeforeImport,
    ),
  ImportModuleIncorectly: () =>
    new EnvError(
      '"EnvModule" module is not imported correctly, you need to use' +
        '"EnvModule.config()" for importing/exporting this module!',
      EnvErrorCode.ImportModuleIncorectly,
    ),
  InvokeConfigMultipleTimes: () =>
    new EnvError(
      'To prevent overriding exist env config, "EnvModule.config" must not be invoked again',
      EnvErrorCode.InvokeConfigMultipleTimes,
    ),
};
