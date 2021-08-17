import { afterEach } from "mocha";
import { expect } from "chai";
import { ControlPlane, Hook, Cell, Transportor, CellularIRQ } from "../../../src";
import { Original, Foo, FooOverride, Bar } from '../../fixture/hook';

describe("Hook - addServiceProxies():", () => {
  beforeEach(async () => {
    @Cell({
      listen: { Original }
    })
    class LocalDriver { }

    await ControlPlane.createNetwork([
      { name: 'Proxy', driver: LocalDriver },
    ]);
  });

  afterEach(async () => {
    await ControlPlane.clean();
  })

  it("can use multiple proxies class", async () => {
    Hook.addServiceProxies(Original, [Foo, Bar]);

    const irq = new CellularIRQ({ unicast: 'Proxy:Original' });
    const rs = await Transportor.send(irq);

    expect(rs.body.original).to.true;
    expect(rs.body.foo).to.true;
    expect(rs.body.bar).to.true;
  });

  it("proxies class can override previous result", async () => {
    Hook.addServiceProxies(Original, [Foo, FooOverride]);

    const irq = new CellularIRQ({ unicast: 'Proxy:Original' });
    const rs = await Transportor.send(irq);

    expect(rs.body.foo).to.false;
  });
});