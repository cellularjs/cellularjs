import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { getLogger, LogLevel } from '../../../src';
import { SimpleLogger } from '../../../src/simple-logger';
import { clearLoggerFactory } from '../../../src/factory';

describe('Default logger(SimpleLogger):', () => {
  afterEach(() => sinon.restore());
  beforeEach(clearLoggerFactory);

  it('Client will get default logger(SimpleLogger) if setLoggerFactory() is not used', async () => {
    const logger = getLogger();

    expect(logger).to.be.instanceOf(SimpleLogger);
  });

  it('Child logger can inherit meta data from parent logger when using from()', () => {
    const parentLoger = getLogger('parentLoger', { key1: 'val1' });
    const childLogger1 = parentLoger.from('childLogger1', { key2: 'val2' });
    const childLogger2 = parentLoger.from('childLogger2');

    expect(parentLoger.getSource()).to.be.eql('parentLoger');
    expect(childLogger1.getSource()).to.be.eql('childLogger1');
    expect(childLogger2.getSource()).to.be.eql('childLogger2');

    expect(parentLoger.getMeta()).to.be.eqls({ key1: 'val1' });
    expect(childLogger1.getMeta()).to.be.eqls({ key1: 'val1', key2: 'val2' });
    expect(childLogger2.getMeta()).to.be.eqls({ key1: 'val1' });
  });

  it('Child logger can inherit log level from its parent when using from()', () => {
    const parentLogger = getLogger('parentLogger');
    parentLogger.setLogLevel(LogLevel.ERROR);
    const childLogger = parentLogger.from('childLogger');

    expect(childLogger.getLogLevel() === parentLogger.getLogLevel()).to.be.true;
  });

  it('Client can add more meta data into logger with setMeta()', () => {
    const logger = getLogger();
    logger.setMeta('k', 'v');

    expect(logger.getMeta('k')).to.eq('v');
  });

  it('SimpleLogger can write log to console', () => {
    const logger = getLogger();

    logger.setLogLevel(LogLevel.DEBUG);

    // logger.debug
    const debugStub = sinon.stub(console, 'debug');
    logger.debug('debug');
    logger.log(LogLevel.DEBUG, 'debug');
    sinon.restore();
    expect(debugStub.calledTwice).to.be.true;

    // logger.info
    const infoStub = sinon.stub(console, 'info');
    logger.info('info');
    logger.log(LogLevel.INFO, 'info');
    sinon.restore();
    expect(infoStub.calledTwice).to.be.true;

    // logger.warn
    const warnStub = sinon.stub(console, 'warn');
    logger.warn('warn');
    logger.log(LogLevel.WARN, 'warn');
    sinon.restore();
    expect(warnStub.calledTwice).to.be.true;

    // logger.error
    const errorStub = sinon.stub(console, 'error');
    logger.error('error');
    logger.log(LogLevel.ERROR, 'error');
    sinon.restore();
    expect(errorStub.calledTwice).to.be.true;

    // logger.fatal
    const fatalStub = sinon.stub(console, 'error');
    logger.fatal('fatal');
    logger.log(LogLevel.FATAL, 'fatal');
    sinon.restore();
    expect(fatalStub.calledTwice).to.be.true;
  });

  it('Default log level is LogLevel.INFO', () => {
    const logger = getLogger();
    expect(logger.getLogLevel()).to.eq(LogLevel.INFO);
  });

  it('Log level', () => {
    const logger = getLogger('CellularJS', { id: 1 });

    // LogLevel.INFO > LogLevel.DEBUG
    logger.setLogLevel(LogLevel.INFO);
    const debugStub = sinon.stub(console, 'debug');
    logger.debug('message');
    expect(debugStub.called).to.be.false;

    logger.setLogLevel(LogLevel.DEBUG);
    logger.debug('message');
    expect(debugStub.called).to.be.true;

    // LogLevel.WARN > LogLevel.INFO
    logger.setLogLevel(LogLevel.WARN);
    const infoStub = sinon.stub(console, 'info');
    logger.info('message');
    expect(infoStub.called).to.be.false;

    // LogLevel.ERROR > LogLevel.WARN
    logger.setLogLevel(LogLevel.ERROR);
    const warnStub = sinon.stub(console, 'warn');
    logger.warn('message');
    expect(warnStub.called).to.be.false;

    // LogLevel.FATAL > LogLevel.ERROR
    logger.setLogLevel(LogLevel.FATAL);
    const errorStub = sinon.stub(console, 'error');
    logger.error('message');
    expect(errorStub.called).to.be.false;
  });
});
