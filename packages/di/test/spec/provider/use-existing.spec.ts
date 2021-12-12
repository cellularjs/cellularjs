import 'mocha';
import { expect } from 'chai';
import { Container, DiErrorCode } from '../../../src';

describe('Provider - useExisting', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('will resolve value with exist provider', async () => {
    await container.addProviders([
      { token: 'pong', useValue: 'pong' },
      { token: 'ping', useExisting: 'pong' },
    ]);

    const resolvedValue = await container.resolve('ping');

    expect(resolvedValue).to.equal('pong');
  });

  it('will throw NoProviderForToken if token in useExisting is not defined', async () => {
    await container.addProviders([
      { token: 'bar', useValue: 'bar' },
      { token: 'foo', useExisting: 'foobar' },
    ]);

    try {
      await container.resolve('foo');

      expect(true).false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });
});