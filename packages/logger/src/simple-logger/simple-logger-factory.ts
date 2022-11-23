import { Logger } from '../logger';
import { LoggerFactory } from '../factory/logger-factory';
import { SimpleLogger } from './simple-logger';
import { LogMeta } from '../logging';

/**
 * @since 0.12.0
 */
export class SimpleLoggerFactory implements LoggerFactory {
  private rootLogger = new SimpleLogger();

  /**
   * @since 0.12.0
   */
  getLogger(source: string, meta?: LogMeta): Logger {
    const activeLogger: Logger = this.rootLogger;
    return activeLogger.from(source || activeLogger.getSource(), meta);
  }
}
