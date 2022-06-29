import { Module, ExtModuleMeta, Token, OnInit } from '@cellularjs/di';
import { Errors } from './errors';

/**
 * DO NOT publish this variable!
 */
let parsedEnv = null;

/**
 * Get enviroment variables from env file only.
 *
 * **IMPORTANT: this function only return parsed env data ONLY AFTER you
 * import `EnvModule` with `EnvModule.config()`**.
 *
 * Usage:
 * ```ts
 * // ./your-env.ts
 * export interface YourEnv {
 *   PORT: string;
 * }
 *
 * export class YourEnv { }
 *
 * // ./some-where.ts
 * import { env } from '@cellularjs/env';
 *
 * // add `EnvModule` by using `EnvModule.config`.
 *
 * env<YourEnv>().PORT;
 * ```
 *
 * @see https://cellularjs.com/docs/how-to%20wiki/env%20variable
 */
export function env<T>(): T {
  if (!parsedEnv) {
    throw Errors.UseEnvFuncBeforeImport();
  }

  return parsedEnv as T;
}

export function clearParsedEnv() {
  parsedEnv = null;
}

interface EnvConfigOptions {
  /**
   * This option allow you to define the token will be used for resolving env
   * variable by yourself.
   *
   * ```ts
   * import { Module, ExtModuleMeta, Token, Injectable } from '@cellularjs/di';
   *
   * // ./your-env.ts
   * export interface YourEnv {
   *   PORT: string;
   * }
   *
   * export class YourEnv { }
   *
   * // EnvModule.config({ token: YourEnv });
   *
   * @Injectable()
   * class YourService {
   *   constructor(private env: YourEnv) { }
   *
   *   halo() {
   *     // this.env.PORT;
   *   }
   * }
   * ```
   */
  token: Token;
}

/**
 * **IMPORTANT: if you want to import this module, use `EnvModule.config`.**
 *
 * @see https://cellularjs.com/docs/how-to%20wiki/env%20variable
 */
@Module({})
export class EnvModule implements OnInit {
  onInit() {
    if (!parsedEnv) {
      throw Errors.ImportModuleIncorectly();
    }
  }

  static config(opts: EnvConfigOptions): ExtModuleMeta {
    if (parsedEnv) {
      throw Errors.InvokeConfigMultipleTimes();
    }

    parsedEnv = require('dotenv-flow').config().parsed;

    return {
      extModule: EnvModule,
      providers: [{ token: opts.token, useFunc: env }],
      exports: [opts.token],
    };
  }
}
