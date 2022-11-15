import { LogLevel } from '.';

export declare type LogMessage = {
  toString(): string;
};

export interface LogMeta {
  [k: string]: any;

  /**
   * Log level.
   *
   * _**(This is reserved meta key. You can use `logger.setLogLevel` to set log level for current logger instance).**_
   */
  level?: never;

  // /**
  //  * _**This is reserved meta key.**_
  //  */
  // traceId?: never;

  /**
   * Log message.
   *
   * _**(This is reserved meta key).**_
   */
  message?: never;

  /**
   * The name of source/operation name(eg: 'User:RegisterCmd', 'PostgresqlModule').
   *
   * _Combine with other meta you can create a log record like this:_
   * ```
   * 2022-10-19T15:46:23.946Z info - [2XxE3bQujbpbfuEc4XnVbb] User:RegisterCmd - start
   * ```
   *
   * _**(This is reserved meta key, you can not set source name as normal meta.
   * You can use `getLogger('source name')` to set source/operation name).**_
   */
  source?: never;
}

export interface Logger {
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
