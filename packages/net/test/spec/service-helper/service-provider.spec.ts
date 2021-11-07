import { afterEach } from 'mocha';
import { createNetWork, cleanNetwork, addServiceProviders, Cell, send, IRQ } from '../../../src';
import { EditFooService, Session } from '../../fixture/serivce-helper';

describe('Service helper - addServiceProviders()', () => {
  beforeEach(async () => {
    @Cell({
      listen: { EditFooService },
    })
    class LocalDriver { }

    await createNetWork([
      { name: 'Provider', driver: LocalDriver },
    ]);
  });

  afterEach(async () => {
    await cleanNetwork();
  })

  it('can add provider for resolving service handler', async () => {
    addServiceProviders(EditFooService, [Session]);

    const irq = new IRQ({ to: 'Provider:EditFooService' });
    await send(irq, { throwOriginalError: true});
  });

  // TODO: add test case to describe service providers is global providers
});