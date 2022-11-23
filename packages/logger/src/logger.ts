import { LogLevel } from './log-level';
import { LogMessage, LogMeta } from './logging';

export interface Logger {
  /**
   * Get source(~operation) name.
   *
   * @since 0.12.0
   */
  getSource(): string | undefined;

  /**
   * Create new logger instance that inherit these below properites from its parent:
   * - Source name(If no source name is provided, it will use source name from parent logger).
   * - Meta(It will combine with parent logger meta to create new meta).
   *
   * @since 0.12.0
   */
  from(source: string, meta?: LogMeta): Logger;

  /**
   * By default, log level is inherit from parent logger, this method allow you to
   * set log level for current logger instance.
   *
   * @since 0.12.0
   */
  setLogLevel(level: LogLevel): void;

  /**
   * Get log level of current logger instance.
   *
   * @since 0.12.0
   */
  getLogLevel(): LogLevel;

  /**
   * @since 0.12.0
   */
  setMeta(k: string, v: any): void;

  /**
   * Get meta by key. If the key is not provided, it will return all meta.
   *
   * @since 0.12.0
   */
  getMeta(k?: string): any;

  /**
   * @since 0.12.0
   */
  debug(message: LogMessage, meta?: LogMeta): void;

  /**
   * @since 0.12.0
   */
  info(message: LogMessage, meta?: LogMeta): void;

  /**
   * @since 0.12.0
   */
  warn(message: LogMessage, meta?: LogMeta): void;

  /**
   * @since 0.12.0
   */
  error(message: LogMessage, meta?: LogMeta): void;

  /**
   * @since 0.12.0
   */
  fatal(message: LogMessage, meta?: LogMeta): void;

  /**
   * _Usage:_
   * ```ts
   * import { LogLevel } from '@cellularjs/logger';
   *
   * logInstance.log(LogLevel.INFO, 'We have just did something');
   *
   * // equal to:
   *
   * logInstance.info('We have just did something');
   * ```
   *
   * @since 0.12.0
   */
  log(level: LogLevel, msg: LogMessage, meta?: LogMeta): void;
}

// /**
//  * @since 0.12.0
//  */
// export class Logger {
//   constructor() {
//     throw new Error(
//       'Instantiate logger instance with this class is forbidden! ' +
//       'If you want to get logger instance, please use `getLogger` function.'
//     );
//   }
// }
