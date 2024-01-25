import { expect } from 'chai';
import { Container, Inject, Optional } from '@cellularjs/di';
import {
  IRQ,
  IRS,
  Service,
  ServiceFactory,
  ServiceHandler,
  addServiceProviders,
  addServiceProxies,
} from '../../../src';

describe('Service factory:', () => {
  it('can resolve service handler without any options', async () => {
    class FooService implements ServiceHandler {
      handle() {}
    }

    const fooService = await ServiceFactory.resolve(FooService);

    expect(fooService).to.instanceOf(FooService);
    expect(await fooService.handle()).to.instanceOf(IRS);
  });

  it('providers, help registering providers for resolving service handler', async () => {
    @Service()
    class FooService implements ServiceHandler {
      constructor(
        @Inject('name')
        public name: string,
        public irq: IRQ,
      ) {}

      handle() {}
    }

    const fooService = await ServiceFactory.resolve(FooService, {
      providers: [
        { token: 'name', useValue: 'bar' },
        { token: IRQ, useValue: 'irq' },
      ],
    });

    expect(fooService).to.instanceOf(FooService);
    expect(fooService.name).to.eq('bar');
    expect(fooService.irq).to.eq('irq');
  });

  it('rootContainer, source for reusable providers', async () => {
    class DbConnection {}

    @Service()
    class FooService implements ServiceHandler {
      constructor(public db: DbConnection) {}

      handle() {}
    }

    const rootContainer = new Container();
    await rootContainer.addProvider(DbConnection);

    const fooService = await ServiceFactory.resolve(FooService, {
      rootContainer,
    });

    expect(fooService).to.instanceOf(FooService);
    expect(fooService.db).to.instanceOf(DbConnection);
  });

  it('includeServiceProxy = false, resolving service handler without its service proxies', async () => {
    class TransactionalProxy implements ServiceHandler {
      handle() {
        return 'bar';
      }
    }

    const Transactional = () => (service: any) => {
      addServiceProxies(service, [TransactionalProxy]);

      return service;
    };

    @Transactional()
    @Service()
    class FooService implements ServiceHandler {
      handle() {
        return 'foo';
      }
    }

    const fooService = await ServiceFactory.resolve(FooService, {
      includeServiceProxy: false,
    });
    const irs = await fooService.handle();

    expect(irs).to.be.instanceOf(IRS);
    expect(irs.body).to.eq('foo');
  });

  it('includeServiceProxy = true, resolving service handler with its service proxies', async () => {
    class TransactionalProxy {
      handle() {
        return 'bar';
      }
    }

    const Transactional = () => (service: any) => {
      addServiceProxies(service, [TransactionalProxy]);

      return service;
    };

    @Transactional()
    @Service()
    class FooService implements ServiceHandler {
      handle() {
        return 'foo';
      }
    }

    const fooService = await ServiceFactory.resolve(FooService, {
      includeServiceProxy: true,
    });
    const irs = await fooService.handle();

    expect(irs).to.instanceOf(IRS);
    expect((irs as unknown as IRS).body).to.eq('bar');
  });

  it('includeServiceProvider = false, resolving service handler without its service providers', async () => {
    const Foo = () => (service: any) => {
      addServiceProviders(service, [{ token: 'foo', useValue: 'foo' }]);

      return service;
    };

    @Foo()
    @Service()
    class FooService implements ServiceHandler {
      constructor(
        @Optional()
        @Inject('foo')
        public foo?: string,
      ) {}

      handle() {}
    }

    const fooService = await ServiceFactory.resolve(FooService);

    expect(fooService.foo).to.undefined;
  });

  it('includeServiceProvider = true, resolving service handler with its service providers', async () => {
    const Foo = () => (service: any) => {
      addServiceProviders(service, [{ token: 'foo', useValue: 'foo' }]);

      return service;
    };

    @Foo()
    @Service()
    class FooService implements ServiceHandler {
      constructor(
        @Optional()
        @Inject('foo')
        public foo?: string,
      ) {}

      handle() {}
    }

    const fooService = await ServiceFactory.resolve(FooService, {
      includeServiceProvider: true,
    });

    expect(fooService.foo).to.eq('foo');
  });
});
