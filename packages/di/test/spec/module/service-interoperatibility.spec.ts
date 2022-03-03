import 'mocha';
import { expect } from 'chai';
import { Container, Module } from '../../../src';

describe('Module - service interoperability:', () => {
  it('exported service can be used as provider', async () => {
    class FooService {}

    @Module({
      exports: [FooService],
    })
    class FooBarModule {}

    const container = new Container();
    await container.addModule(FooBarModule);
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
    class FooBarModule {}

    const container = new Container();
    await container.addModule(FooBarModule);
    const resolvedValue = await container.resolve(FooService);

    expect(resolvedValue).to.be.instanceOf(FooService);
  });
});
