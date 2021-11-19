import 'mocha';
import { expect } from 'chai';
import { Container, Optional, Injectable, DiErrorCode } from '../../../src';

describe('Annotation - Optional():', () => {
  it('will throw NoProviderForToken if there is no Optional', async () => {
    class Bar { }

    @Injectable()
    class FooWithoutOptional {
      constructor(
        public bar: Bar,
      ) { }
    }

    const container = new Container();
    container.addProvider(FooWithoutOptional);

    try {
      await container.resolve(FooWithoutOptional);

      expect(true).false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken)
    }
  });

  it('can prevent throwing NoProviderForToken error', async () => {
    class Bar { }

    @Injectable()
    class FooWithOptional {
      constructor(
        @Optional() public bar: Bar,
      ) { }
    }

    const container = new Container();
    container.addProvider(FooWithOptional);

    const foo = await container.resolve<FooWithOptional>(FooWithOptional);

    // If there is no provider it will return undefined
    expect(foo.bar).to.be.undefined;
  });
});