import { LogLevel } from './log-level';
import { LogMessage, LogMeta } from './logging';

export interface Logger {
  /**
   * Get source(~operation) name.
   * @since 0.12.0
   */
  getSource(): string | undefined;

  /**
   * Create new logger instance that inherit these below properites from its parent:
   * - Meta.
   * - Log level.
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
   * @since 0.12.0
   */
  getLogLevel(): LogLevel;

  /**
   * @since 0.12.0
   */
  setMeta(k: string, v: any): void;

  /**
   * @since 0.12.0
   */
  getMeta(k?: string): any;

  /**
   * "A log level used for events considered to be useful during software debugging
   * when more granular information is needed." - sematext.com
   *
   * @since 0.12.0
   */
  debug(message: LogMessage, meta?: LogMeta): void;

  /**
   * "An event happened, the event is purely informative and can be ignored during
   * normal operations." - sematext.com
   *
   * @since 0.12.0
   */
  info(message: LogMessage, meta?: LogMeta): void;

  /**
   * Same as warn("Unexpected behavior happened inside the application, but it is continuing
   * its work and the key business features are operating as expected." - sematext.com)
   *
   * @since 0.12.0
   */
  warn(message: LogMessage, meta?: LogMeta): void;

  /**
   * "One or more functionalities are not working, preventing some functionalities
   * from working correctly." - sematext.com
   *
   * @since 0.12.0
   */
  error(message: LogMessage, meta?: LogMeta): void;

  /**
   * "One or more key business functionalities are not working and the whole system
   * doesn’t fulfill the business functionalities." - sematext.com
   *
   * @since 0.12.0
   */
  fatal(message: LogMessage, meta?: LogMeta): void;

  /**
   * ```ts
   * // Usage:
   * import { LogLevel } from '@cellularjs/logger';
   *
   * logInstance.log(LogLevel.INFO, 'We have just did something');
   * // same as: logInstance.info('We have just did something');
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
