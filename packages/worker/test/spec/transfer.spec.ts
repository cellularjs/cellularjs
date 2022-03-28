import 'mocha';
import { expect } from 'chai';
import * as path from 'path';
import sinon from 'sinon';
import { IRQ } from '@cellularjs/net';
import { createPool, transfer } from '../../src';
import { cleanAllPools, WorkerErrorCode, Thread } from '../../src/internal';

const workerScript = path.resolve(
  __dirname,
  '../fixture/init-net-worker-from-child-thread-helper.js'.replace(
    '/',
    path.sep,
  ),
);

describe('transfer:', () => {
  afterEach(async () => {
    sinon.restore();
    await cleanAllPools();
  });

  it('throw error if client transfer message from child thread', async () => {
    await createPool({ script: workerScript });
    const irq = await transfer(new IRQ({ to: 'Foo:UserTransfer' }));

    expect(irq.body).to.true;
  });

  it('throw error if specified pool is not exists', async () => {
    try {
      await transfer(new IRQ({ to: 'Any:Any' }), {
        pool: 'not-exist',
      });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.eql(WorkerErrorCode.PoolIsNotExists);
    }
  });

  it('throw error if transfer is invoked from child thread', async () => {
    sinon.stub(Thread, 'isMainThread').get(() => false);

    try {
      await transfer(new IRQ({ to: 'Any:Any' }));

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.eql(WorkerErrorCode.TransferFromChildThread);
    }
  });

  it('can specify pool for transfering message', async () => {
    await createPool({ name: 'hey', script: workerScript });
    const irq = await transfer(new IRQ({ to: 'Foo:BarService' }), {
      pool: 'hey',
    });

    expect(irq.body).to.eqls('BarService');
  });

  it('can send IRQ and get success IRS', async () => {
    await createPool({ script: workerScript });
    const irq = await transfer(new IRQ({ to: 'Foo:BarService' }));

    expect(irq.body).to.eqls('BarService');
  });

  it('can wait for available thread to run', async () => {
    await createPool({ script: workerScript, minThread: 2 });
    const [irq1, irq2, irq3] = await Promise.all([
      transfer(new IRQ({ to: 'Foo:BarService' })),
      transfer(new IRQ({ to: 'Foo:BarService' })),
      transfer(new IRQ({ to: 'Foo:BarService' })),
    ]);

    expect(irq1.body).to.eqls('BarService');
    expect(irq2.body).to.eqls('BarService');
    expect(irq3.body).to.eqls('BarService');
  });

  it('can send IRQ and get error IRS', async () => {
    try {
      await createPool({ script: workerScript });
      await transfer(new IRQ({ to: 'Foo:ErrorService' }));

      expect(true).to.false;
    } catch (err) {
      expect(err.body).to.eql('ErrorService');
    }
  });
});
