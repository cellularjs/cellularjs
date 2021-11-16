import 'mocha';
import { expect } from 'chai';
import { Container, DiErrorCode } from '../../../src';
import { FooWithoutForwardRef, FooWithForwardRef, Bar } from '../../fixture/circular-dependency-injection'

describe('forwardRef', () => {
  it('can not resolve circular dependency with normal dependency declaration', async () => {
    const container = new Container();

    container.addProviders([
      { token: Bar, useClass: Bar },
      { token: FooWithoutForwardRef, useClass: FooWithoutForwardRef }
    ]);

    try {
      await container.resolve(FooWithoutForwardRef);

      expect(true).to.false;
    } catch (err) {
      expect(err.code === DiErrorCode.NoProviderForToken).true;
    }
  });

  it('can be used for resolving circular dependency', async () => {
    const container = new Container();

    container.addProviders([
      { token: Bar, useClass: Bar },
      { token: FooWithForwardRef, useClass: FooWithForwardRef }
    ]);
    const fooWithForwardRef = await container.resolve<FooWithForwardRef>(FooWithForwardRef);

    expect(fooWithForwardRef.bar instanceof Bar).to.be.true;
  });
});