import { LogLevel } from '../log-level';
import { LogMessage, LogMeta } from '../logging';
import { Logger } from '../logger';

const logLevelName = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

/**
 * CellularJS Simple Logger
 *
 * _Features:_
 * - support write log to console.
 *
 * @since 0.12.0
 */
export class SimpleLogger implements Logger {
  private level: LogLevel = LogLevel.INFO;

  private logMethodMap = {
    [LogLevel.DEBUG]: this.debug.bind(this),
    [LogLevel.INFO]: this.info.bind(this),
    [LogLevel.WARN]: this.warn.bind(this),
    [LogLevel.ERROR]: this.error.bind(this),
    [LogLevel.FATAL]: this.fatal.bind(this),
  };

  constructor(private source?: string, private meta: LogMeta = {}) {}

  getLogLevel(): LogLevel {
    return this.level;
  }

  setMeta(k: string, v: any): void {
    this.meta[k] = v;
  }

  getMeta(k?: string) {
    return k ? this.meta[k] : this.meta;
  }

  getSource(): string | undefined {
    return this.source;
  }

  from(source: string, meta?: LogMeta): Logger {
    const newLogger = new SimpleLogger(source, { ...this.meta, ...meta });

    newLogger.setLogLevel(this.level);

    return newLogger;
  }

  setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  debug(msg: LogMessage, meta?: LogMeta): void {
    if (this.level < LogLevel.DEBUG) return;

    console.debug(this.format(LogLevel.DEBUG, msg, { ...this.meta, ...meta }));
  }

  info(msg: LogMessage, meta?: LogMeta): void {
    if (this.level < LogLevel.INFO) return;

    console.info(this.format(LogLevel.INFO, msg, { ...this.meta, ...meta }));
  }

  warn(msg: LogMessage, meta?: LogMeta): void {
    if (this.level < LogLevel.WARN) return;

    console.warn(this.format(LogLevel.WARN, msg, { ...this.meta, ...meta }));
  }

  error(msg: LogMessage, meta?: LogMeta): void {
    if (this.level < LogLevel.ERROR) return;

    console.error(this.format(LogLevel.ERROR, msg, { ...this.meta, ...meta }));
  }

  fatal(msg: LogMessage, meta?: LogMeta): void {
    console.error(this.format(LogLevel.FATAL, msg, { ...this.meta, ...meta }));
  }

  log(level: LogLevel, msg: LogMessage, meta: LogMeta = {}): void {
    this.logMethodMap[level](msg, meta);
  }

  private format(level: LogLevel, msg: LogMessage, meta?: LogMeta) {
    const ts = new Date().toISOString();
    const pad = level === LogLevel.INFO ? ' ' : '';
    const source = this.source ? `- ${this.source}` : '';
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';

    return `${ts} ${
      logLevelName[level]
    }${pad} ${source}: ${msg.toString()}${metaStr}`;
  }
}
