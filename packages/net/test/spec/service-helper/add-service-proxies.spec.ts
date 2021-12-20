import { afterEach } from 'mocha';
import { expect } from 'chai';
import { createNetWork, addServiceProxies, Cell, send, IRQ } from '../../../src';
import { cleanNetwork } from '../../../src/internal';
import { Original, Foo, FooOverride, Bar } from '../../fixture/serivce-helper';

describe('Service helper - addServiceProxies():', () => {
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
    addServiceProxies(Original, [Foo, Bar]);

    const irq = new IRQ({ to: 'Proxy:Original' });
    const rs = await send(irq);

    expect(rs.body.original).to.true;
    expect(rs.body.foo).to.true;
    expect(rs.body.bar).to.true;
  });

  it('proxy will run from highest index', async () => {
    addServiceProxies(Original, [Foo, FooOverride, Bar]);

    const irq = new IRQ({ to: 'Proxy:Original' });
    const rs = await send(irq, { throwOriginalError: true});

    expect(rs.body.original).to.true;
    expect(rs.body.foo).to.false;
    expect(rs.body.bar).to.true;
  });
});