import 'mocha';
import { expect } from 'chai';
import { Container, Module, ExtModuleMeta } from '../../../src';

describe('Module - service interoperability:', () => {
  it('exported service can be used as provider', async () => {
    class FooService {}

    @Module({
      exports: [FooService],
    })
    class FooModule {}

    const container = new Container();
    await container.addModule(FooModule);
    const resolvedValue = await container.resolve(FooService);

    expect(resolvedValue).to.be.instanceOf(FooService);
  });

  it('exported service can be overridden if corresponding provider exist', async () => {
    class Foo {}
    class Bar {}

    @Module({
      providers: [{ token: Foo, useClass: Bar }],
      exports: [Foo],
    })
    class FooModule {}

    const container = new Container();
    await container.addModule(FooModule);

    const resolvedVal = await container.resolve(Foo);

    expect(resolvedVal).to.be.instanceOf(Bar);
  });

  it('service class can exist in both providers and exports', async () => {
    class FooService {}

    @Module({
      providers: [FooService],
      exports: [FooService],
    })
    class FooModule {}

    const container = new Container();
    await container.addModule(FooModule);
    const resolvedValue = await container.resolve(FooService);

    expect(resolvedValue).to.be.instanceOf(FooService);
  });

  it('extModule, exported service can be used as provider', async () => {
    class FooService {}

    @Module({})
    class FooModule {
      static config(): ExtModuleMeta {
        return {
          extModule: FooModule,
          exports: [FooService],
        };
      }
    }

    const container = new Container();
    await container.addModule(FooModule.config());
    const resolvedValue = await container.resolve(FooService);

    expect(resolvedValue).to.be.instanceOf(FooService);
  });

  it('extModule, exported service can be overridden if corresponding provider exist in ExtModuleMeta', async () => {
    class Foo {}
    class Bar {}

    @Module({})
    class FooModule {
      static config(): ExtModuleMeta {
        return {
          extModule: FooModule,
          providers: [{ token: Foo, useClass: Bar }],
          exports: [Foo],
        };
      }
    }

    const container = new Container();
    await container.addModule(FooModule.config());

    const resolvedVal = await container.resolve(Foo);

    expect(resolvedVal).to.be.instanceOf(Bar);
  });

  it('extModule, exported service can not be overridden if corresponding provider exist in parent module', async () => {
    class Foo {}
    class Bar {}

    @Module({
      providers: [{ token: Foo, useClass: Bar }],
    })
    class FooModule {
      static config(): ExtModuleMeta {
        return {
          extModule: FooModule,
          exports: [Foo],
        };
      }
    }

    const container = new Container();
    await container.addModule(FooModule.config());

    const resolvedVal = await container.resolve(Foo);

    expect(resolvedVal).to.be.instanceOf(Foo);
    expect(resolvedVal).to.be.not.instanceOf(Bar);
  });

  it('extModule, service class can exist in both providers and exports', async () => {
    class FooService {}

    @Module({})
    class FooModule {
      static config(): ExtModuleMeta {
        return {
          extModule: FooModule,
          providers: [FooService],
          exports: [FooService],
        };
      }
    }

    const container = new Container();

    await container.addModule(FooModule.config());
    const resolvedValue = await container.resolve(FooService);

    expect(resolvedValue).to.be.instanceOf(FooService);
  });
});
