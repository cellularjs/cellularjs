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

export const setDefaultCatch = function (defaultCatch?: TransactionalCatch) {
  if (_defaultCatch) {
    throw new Error('Default catch already exist!');
  }

  _defaultCatch = defaultCatch;
};

/**
 * For internal only!
 */
export const clearDefaultCatch = function () {
  _defaultCatch = null;
};

/**
 * For internal only!
 */
export const getDefaultCatch = function () {
  return _defaultCatch;
};
