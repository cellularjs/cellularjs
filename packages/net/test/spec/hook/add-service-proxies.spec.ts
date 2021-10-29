import { afterEach } from 'mocha';
import { expect } from 'chai';
import { createNetWork, cleanNetwork, Hook, Cell, send, IRQ } from '../../../src';
import { Original, Foo, FooOverride, Bar } from '../../fixture/hook';

describe('Hook - addServiceProxies():', () => {
  beforeEach(async () => {
    @Cell({
      listen: { Original },
    })
    class LocalDriver { }

    await createNetWork([
      { name: 'Proxy', driver: LocalDriver },
    ]);
  });

  afterEach(async () => {
    await cleanNetwork();
  })

  it('can use multiple proxies class', async () => {
    Hook.addServiceProxies(Original, [Foo, Bar]);

    const irq = new IRQ({ unicast: 'Proxy:Original' });
    const rs = await send(irq);

    expect(rs.body.original).to.true;
    expect(rs.body.foo).to.true;
    expect(rs.body.bar).to.true;
  });

  it('proxies class can override previous result', async () => {
    Hook.addServiceProxies(Original, [Foo, FooOverride]);

    const irq = new IRQ({ unicast: 'Proxy:Original' });
    const rs = await send(irq);

    expect(rs.body.foo).to.false;
  });
});