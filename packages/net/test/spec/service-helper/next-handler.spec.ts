import { afterEach } from 'mocha';
import { expect } from 'chai';
import { Container, Injectable } from '@cellularjs/di';
import {
  createNetWork,
  Service,
  addServiceProxies,
  Cell,
  send,
  IRQ,
  NextHandler,
  clearNetwork,
} from '../../../src';

@Service({ scope: 'publish' })
class BarService {
  handle() {
    return 'bar';
  }
}

describe('NextHandler:', () => {
  beforeEach(async () => {
    @Cell({
      listen: { BarService },
    })
    class LocalDriver {}

    await createNetWork([{ name: 'Foo', driver: LocalDriver }]);
  });

  afterEach(async () => {
    await clearNetwork();
  });

  it('can invoke next proxy/service handler', async () => {
    @Injectable()
    class BarProxy {
      constructor(private nextHandler: NextHandler) {}

      async handle() {
        const irs = await this.nextHandler.handle();
        return 'foo' + irs.body;
      }
    }

    addServiceProxies(BarService, [BarProxy]);

    const irq = new IRQ({ to: 'Foo:BarService' });
    const irs = await send(irq);

    expect(irs.body).to.be.eq('foobar');
  });

  it('can get extModule with getExtModule()', async () => {
    let extModule = null;

    @Injectable()
    class BarProxy {
      constructor(private nextHandler: NextHandler) {}

      handle() {
        extModule = this.nextHandler.getExtModule();
      }
    }

    addServiceProxies(BarService, [BarProxy]);

    const irq = new IRQ({ to: 'Foo:BarService' });
    await send(irq);

    expect(extModule).is.instanceOf(Container);
  });
});
