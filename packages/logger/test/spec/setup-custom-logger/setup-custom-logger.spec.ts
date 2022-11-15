import 'mocha';
import { expect } from 'chai';
import {
  getLogger,
  Logger,
  LoggerFactory,
  LogMeta,
  setLoggerFactory,
} from '../../../src';
import { clearLoggerFactory } from '../../../src/factory/logger-factory-injector';
import { SimpleLogger } from '../../../src/simple-logger';

describe('Setup custom logger:', () => {
  beforeEach(clearLoggerFactory);

  it('If setLoggerFactory() is invoked after the first getLogger is called, it will throw an error', async () => {
    getLogger();

    class DummyLoggerFactory implements LoggerFactory {
      getLogger() {
        return null;
      }
    }

    expect(() => setLoggerFactory(new DummyLoggerFactory())).to.throw();
  });

  it('If setLoggerFactory() is invoked multiple times, it will throw an error', async () => {
    class DummyLoggerFactory implements LoggerFactory {
      getLogger() {
        return null;
      }
    }

    setLoggerFactory(new DummyLoggerFactory());

    expect(() => setLoggerFactory(new DummyLoggerFactory())).to.throw();
  });

  it('Logger factory must be able to create new logger', () => {
    class MyLogger extends SimpleLogger {}

    class MyLoggerFactory implements LoggerFactory {
      getLogger(source?: string, meta?: LogMeta): Logger {
        return new MyLogger(source, meta);
      }
    }

    setLoggerFactory(new MyLoggerFactory());

    const logger = getLogger();

    expect(logger).to.be.instanceOf(MyLogger);
  });
});
