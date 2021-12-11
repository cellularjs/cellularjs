import 'mocha';
import { expect } from 'chai';
import { Container, DiErrorCode, Injectable, Inject, Module, ExtModuleMeta } from '../../../src';

let container: Container;

beforeEach(() => {
  container = new Container();
});

describe('Container - resolve:', () => {
  it('can not resole value by token that is not exist', async () => {
    const errorFunc = () => container.resolve(123);

    expect(errorFunc)
      .to.throw()
      .with.property('code', DiErrorCode.NoProviderForToken);
  });

  it('can resolve global providers', async () => {
    const global = new Container();
    global.addProviders([
      { token: 'foo', useValue: 'global' },
    ])

    @Injectable()
    class FooBar {
      constructor(
        @Inject('foo') public foo,
      ) { }
    }

    container.addProvider({ token: FooBar, useClass: FooBar });

    const foobar = await container.resolve<FooBar>(FooBar, { global });
    expect(foobar.foo).to.equal('global');
  });

  it('global provider has lower priority than normal providers', async () => {
    const global = new Container();
    global.addProviders([
      { token: 'foo', useValue: 'global' },
    ])

    @Injectable()
    class FooBar {
      constructor(
        @Inject('foo') public foo,
      ) { }
    }

    container.addProviders([
      { token: FooBar, useClass: FooBar },
      { token: 'foo', useValue: 'foo' },
    ]);

    const foobar = await container.resolve<FooBar>(FooBar, { global });
    expect(foobar.foo).to.equal('foo');
  });

  it('global provider has lower priority than ref module(~ extend module)', async () => {
    const global = new Container();
    global.addProviders([
      { token: 'foo', useValue: 'global' },
    ]);

    @Injectable()
    class FooBar {
      constructor(
        @Inject('foo') public foo,
      ) { }
    }

    @Module({})
    class FooModule {
      static extend(): ExtModuleMeta {
        return {
          extModule: FooModule,
          providers: [{ token: 'foo', useValue: 'foo' }],
          exports: [FooBar],
        };
      }
    }

    container.addModule(FooModule.extend());

    const foobar = await container.resolve<FooBar>(FooBar, { global });
    expect(foobar.foo).to.equal('foo');
  });

  it('create only one value for provider has cycle is permanent when resolving value in sync', async () => {
    class Foo { }

    container.addProvider({
      token: Foo,
      useClass: Foo,
      cycle: 'permanent',
    });

    const foo1 = await container.resolve<Foo>(Foo);
    const foo2 = await container.resolve<Foo>(Foo);

    expect(foo1 === foo2).to.be.true;
  });

  it('create other value when resolving value in async even if provider\'s cycle is permanent', async () => {
    class Foo { }

    container.addProvider({
      token: Foo,
      useClass: Foo,
      cycle: 'permanent',
    });

    const [foo1, foo2] = await Promise.all([
      container.resolve<Foo>(Foo),
      container.resolve<Foo>(Foo),
    ]);

    expect(foo1 !== foo2).to.be.true;
  });

  it('can not make use of permanent cycle if value is resolved in async', async () => {
    container.addProvider({
      token: Container,
      useClass: Container,
    });

    const [firstContainer, secondContainer] = await Promise.all([
      container.resolve(Container),
      container.resolve(Container),
    ]);

    expect(firstContainer).to.instanceOf(Container);
    expect(firstContainer !== secondContainer).to.true;
  })
});