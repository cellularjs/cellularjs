import 'mocha';
import { expect } from 'chai';
import { Container, DiErrorCode } from '../../../src';
import { FooWithoutForwardRef, FooWithForwardRef, Bar, useFuncProviderWithForwardRef, useFuncProviderWithoutForwardRef } from '../../fixture/circular-dependency-injection'

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
      { token: FooWithForwardRef, useClass: FooWithForwardRef },
    ]);
    const fooWithForwardRef = await container.resolve<FooWithForwardRef>(FooWithForwardRef);

    expect(fooWithForwardRef.bar instanceof Bar).to.be.true;
  });

  it('can not resolve circular dependency with normal provider declaration with  useFunc', async () => {
    const container = new Container();

    container.addProvider(useFuncProviderWithoutForwardRef);
    container.addProvider({ token: Bar, useClass: Bar });

    const bar = await container.resolve('bar');

    expect(bar instanceof Bar).to.false;
  });

  it('can be used for resolving circular dependency with useFunc provider', async () => {
    const container = new Container();

    container.addProvider(useFuncProviderWithForwardRef);
    container.addProvider({ token: Bar, useClass: Bar });

    const bar = await container.resolve('bar');

    expect(bar instanceof Bar).to.true;
  });
});