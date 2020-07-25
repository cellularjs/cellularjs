const ERROR_CTX = "@cellularjs/net";

export const ErrorCode = {
  NoProviderForToken: 1,
};

export const ErrorMsg = {
  XXX: (token) => ({
    ctx: ERROR_CTX,
    code: ErrorCode.NoProviderForToken,
    msg: `There is no provider for "xxx"`,
  }),
};
