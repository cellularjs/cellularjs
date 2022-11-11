import 'mocha';
import { expect } from 'chai';
import {
  addProxy,
  clearModuleMap,
  Container,
  Injectable,
  ProxyContext,
  ProxyHandler,
} from '../../../src';

describe('Proxy:', () => {
  beforeEach(clearModuleMap);

  it('Client can register a proxy with addProxy().', async () => {
    class Tree {}
    class SuperProtector implements ProxyHandler {
      handle() {
        return 'SUPER PROTECTOR';
      }
    }

    addProxy(Tree, { proxy: SuperProtector });

    const container = new Container();
    await container.addProvider(Tree);
    const rs = await container.resolve(Tree);

    expect(rs).to.eq('SUPER PROTECTOR');
  });

  it('It will use useClass(instead of token) as a key for storing & retrieving proxies', async () => {
    class Tree {}
    class SuperProtector implements ProxyHandler {
      handle() {
        return 'SUPER PROTECTOR';
      }
    }

    addProxy(Tree, { proxy: SuperProtector });

    const container = new Container();
    await container.addProvider({ token: 'token', useClass: Tree });
    const rs = await container.resolve('token');

    expect(rs).to.eq('SUPER PROTECTOR');
  });

  it('Proxy can get current proxy context by using ProxyContext.', async () => {
    class Tree {}

    @Injectable()
    class SuperProtector implements ProxyHandler {
      constructor(ctx: ProxyContext) {
        proxyCtx = ctx;
      }

      handle() {}
    }

    addProxy(Tree, { proxy: SuperProtector });

    let proxyCtx;
    const container = new Container();
    await container.addProvider(Tree);
    await container.resolve(Tree);

    expect(proxyCtx).to.instanceOf(ProxyContext);
  });

  it('Client can get proxy meta from ProxyContext.', async () => {
    class Tree {}

    @Injectable()
    class SuperProtector implements ProxyHandler {
      constructor(ctx: ProxyContext) {
        metaValue = ctx.meta;
      }

      handle() {}
    }

    addProxy(Tree, { proxy: SuperProtector, meta: true });

    let metaValue;
    const container = new Container();
    await container.addProvider(Tree);
    await container.resolve(Tree);

    expect(metaValue).to.eq(true);
  });

  it('Client can get token from proxy context.', async () => {
    class Tree {}

    @Injectable()
    class SuperProtector implements ProxyHandler {
      constructor(ctx: ProxyContext) {
        token = ctx.token;
      }

      handle() {}
    }

    addProxy(Tree, { proxy: SuperProtector, meta: true });

    let token;
    const container = new Container();
    await container.addProvider(Tree);
    await container.resolve(Tree);

    expect(token).to.eq(Tree);
  });

  it('Client can move to next pipe with ProxyContext#next().', async () => {
    class Tree {}

    @Injectable()
    class SuperProtector implements ProxyHandler {
      constructor(private ctx: ProxyContext) {}

      handle() {
        return this.ctx.next();
      }
    }

    @Injectable()
    class SuperProtector2 implements ProxyHandler {
      handle() {
        return SuperProtector2;
      }
    }

    addProxy(Tree, { proxy: SuperProtector });
    addProxy(Tree, { proxy: SuperProtector2 });

    const container = new Container();
    await container.addProvider(Tree);
    const rs = await container.resolve(Tree);

    expect(rs).to.eq(SuperProtector2);
  });

  it('Client can get extModule from ProxyContext and use it.', async () => {
    class Leaf {}

    @Injectable()
    class Tree {
      constructor(public leaf: Leaf) {}
    }

    @Injectable()
    class SuperProtector implements ProxyHandler {
      constructor(private ctx: ProxyContext) {}

      async handle() {
        const extModule = this.ctx.getExtModule();
        await extModule.addProvider(Leaf);

        return this.ctx.next();
      }
    }

    addProxy(Tree, { proxy: SuperProtector });

    const container = new Container();
    await container.addProvider(Tree);
    const tree = await container.resolve<Tree>(Tree);

    expect(tree.leaf).to.be.instanceOf(Leaf);
  });

  it('If client provide extModule, it will be used instead of creating by proxy runner.', async () => {
    class Leaf {}

    @Injectable()
    class Tree {
      constructor(public leaf: Leaf) {}
    }

    @Injectable()
    class SuperProtector implements ProxyHandler {
      constructor(private ctx: ProxyContext) {}

      async handle() {
        return this.ctx.next();
      }
    }

    addProxy(Tree, { proxy: SuperProtector });

    const container = new Container();
    await container.addProvider(Tree);

    const extModule = new Container();
    await extModule.addProvider(Leaf);

    const tree = await container.resolve<Tree>(Tree, { extModule });

    expect(tree.leaf).to.be.instanceOf(Leaf);
  });
});
