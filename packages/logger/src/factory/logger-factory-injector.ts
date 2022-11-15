import { LogMeta, Logger } from '..';
import { SimpleLoggerFactory } from '../simple-logger';
import { LoggerFactory } from './logger-factory';

/**
 * Local variable that used to store logger factory instance.
 *
 * _DO NOT import/export this variable!!!_
 *
 * @since 0.12.0
 */
let _loggerFactory: LoggerFactory;

/**
 * Get new logger that inherit these below properites from current active logger:
 * - Source name(If no source name is provided, it will use source name from parent logger).
 * - Meta(It will combine with parent logger meta to create a new meta).
 *
 * _**NOTE:** If `getLogger` is used before `setLoggerFactory` is called, it
 * will use `SimpleLoggerFactory`. So to customize default logger, you need
 * to call `setLoggerFactory` firstly._
 *
 * @param source Source/Operation name(eg: 'User:RegisterCmd', 'TypeOrmModule',...).
 * @param meta Initial meta data for new logger.
 * @since 0.12.0
 */
export function getLogger(source?: string, meta?: LogMeta): Logger {
  if (!_loggerFactory) setLoggerFactory(new SimpleLoggerFactory());

  return _loggerFactory.getLogger(source, meta);
}

/**
 * Set logger factory that used to create logger.
 *
 * Note: there is only one logger factory. If you try to override
 * existed logger factory, it will throw an error.
 *
 * @since 0.12.0
 */
export function setLoggerFactory(loggerFactory: LoggerFactory) {
  if (!!_loggerFactory)
    throw new Error(
      'Logger factory is existed:' +
        '\n- other library or you code invoked `setLoggerFactory` before.' +
        '\n- `getLogger` is invoked from lib or your code before `setLoggerFactory` is called.',
    );

  _loggerFactory = loggerFactory;
}

/**
 * This function should be use for development only!!!
 *
 * @since 0.12.0
 */
export function clearLoggerFactory() {
  _loggerFactory = null;
}
