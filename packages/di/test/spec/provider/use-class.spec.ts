import 'mocha';
import { expect } from 'chai';
import { Container, Injectable } from '../../../src';

describe('Provider - class/useClass', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('can resolve value from useClass provider', async () => {
    container.addProvider({
      token: Container,
      useClass: Container,
    });

    const resolveValue = await container.resolve(Container);

    expect(resolveValue).to.instanceOf(Container);
  });

  it('can cache resolved value when using useClass provider with permanent cycle', async () => {
    container.addProvider({
      token: Container,
      useClass: Container,
      cycle: 'permanent',
    });

    const firstResolvedValue = await container.resolve(Container);
    const secondResolvedValue = await container.resolve(Container);

    expect(firstResolvedValue === secondResolvedValue).to.true;
  });

  it('will resolve dependencies declared in class constructor one by one', async () => {
    @Injectable()
    class Foo {
      constructor(
        public firstContainer: Container,
        public secondContainer: Container,
      ) { }
    }

    container.addProviders([
      Foo,
      {
        token: Container,
        useClass: Container,
        cycle: 'permanent',
      },
    ]);

    const foo = await container.resolve<Foo>(Foo);

    expect(foo.firstContainer === foo.secondContainer).to.true;
  })

  it('will create new value for same type of provider if it is not declared as permanent', async () => {
    @Injectable()
    class Foo {
      constructor(
        public firstContainer: Container,
        public secondContainer: Container,
      ) { }
    }

    container.addProviders([
      Foo,
      {
        token: Container,
        useClass: Container,
      },
    ]);

    const foo = await container.resolve<Foo>(Foo);

    expect(foo.firstContainer !== foo.secondContainer).to.true;
  })

  it('can resolve class as useClass provider', async () => {
    container.addProvider(Container);

    expect(await container.resolve(Container)).to.instanceOf(Container);
  });
});