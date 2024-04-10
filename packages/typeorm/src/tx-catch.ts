import { ServiceHandler } from '@cellularjs/net';

export type TxContext = { [key: string | symbol]: any };

export type CatchOpts = {
  error: any;

  service: ServiceHandler;

  /**
   * `ctx` is a pure object. It is mainly used for storing temporary data.
   * @example https://cellularjs.com/docs/how-to%20wiki/typeorm#421-setdefaultcatch
   */
  ctx: TxContext;
};

export type TransactionalCatch = (opts: CatchOpts) => Promise<any>;

let _defaultCatch: TransactionalCatch;

/**
 * Set default error handler when using `Transactional` decorator.
 *
 * Example:
 * ```ts
 * // global.ts
 * import { TransactionalCatch, setDefaultCatch } from '@cellularjs/typeorm';
 *
 * const MAX_RETRY = 1;
 *
 * const txCatch: TransactionalCatch = async ({ error, service, ctx }) => {
 *  // Ref: https://www.postgresql.org/docs/current/mvcc-serialization-failure-handling.html
 *  if (error?.code !== '40001') throw error;
 *
 *  ctx.try ||= 0;
 *  ctx.try++;
 *
 *  if (ctx.try > MAX_RETRY) throw error;
 *
 *  return await service.handle();
 * }
 *
 * setDefaultCatch(txCatch);
 * ```
 * @since 0.19.0
 * @see https://cellularjs.com/docs/how-to%20wiki/typeorm#42-error-handling
 */
export const setDefaultCatch = function (defaultCatch: TransactionalCatch) {
  if (_defaultCatch) {
    throw new Error('Default catch already exist!');
  }

  _defaultCatch = defaultCatch;
};

/**
 * For internal usage only!
 */
export const clearDefaultCatch = function () {
  _defaultCatch = null;
};

/**
 * For internal usage only!
 */
export const getDefaultCatch = function () {
  return _defaultCatch;
};
