/**
 * Cell options token
 */
export const CLL_CELL_OPTS = 'cll:net:cell:opts';

/**
 * Service options token
 */
export const CLL_SERVICE_OPTS = 'cll:net:service:opts';

/**
 * @see https://cellularjs.com/docs/foundation/net/virtual-network#13-driver
 * @since 0.1.0
 */
export const LOCAL_DRIVER = 'local';

/**
 * Eg:
 * file.ts => Pass
 * __tests__/file.spec.ts => Fail
 * __tests__/sub/file.ts => Fail
 * file.spec.ts => Fail
 * file.test.ts => Fail
 * file.d.ts => Fail
 *
 * Note: please DO NOT import this constant!
 */
export const _UNSTABLE_TS_FILE_REGEX_STR =
  '/^(?!.*(__tests__\\/.*).ts$)(?!.*(\\.spec|\\.test|\\.d)\\.ts$).*\\.ts$/';

export const validTsReg = new RegExp(
  _UNSTABLE_TS_FILE_REGEX_STR
    .replace('\\', '')
    .slice(1, _UNSTABLE_TS_FILE_REGEX_STR.length - 2),
);
