import "mocha";
import { expect } from "chai";
import { Container, DiErrorCode, Injectable, Inject, Module, ExtModuleMeta } from "../../../src";

let container: Container;

beforeEach(() => {
  container = new Container();
});

describe("Container - resolve:", () => {
  it("can not resole value by token that is not exist", async () => {
    try {
      await container.resolve(123);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(DiErrorCode.NoProviderForToken);
    }
  });

  it("can resolve global providers", async () => {
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

  it("global provider has lower priority than normal providers", async () => {
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

  it("global provider has lower priority than ref module(~ extend module)", async () => {
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
});