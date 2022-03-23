import 'mocha';
import { expect } from 'chai';
import * as path from 'path';
import sinon from 'sinon';
import { IRQ } from '@cellularjs/net';
import { createCluster, transfer } from '../../src';
import { cleanAllClusters, WorkerErrorCode, Thread } from '../../src/internal';

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
    await cleanAllClusters();
  });

  it('throw error if client transfer message from child thread', async () => {
    await createCluster({ script: workerScript });
    const irq = await transfer(new IRQ({ to: 'Foo:UserTransfer' }));

    expect(irq.body).to.true;
  });

  it('throw error if specified cluster is not exists', async () => {
    try {
      await transfer(new IRQ({ to: 'Any:Any' }), {
        cluster: 'not-exist',
      });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.eql(WorkerErrorCode.ClusterIsNotExists);
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

  it('can specify cluster for transfering message', async () => {
    await createCluster({ name: 'hey', script: workerScript });
    const irq = await transfer(new IRQ({ to: 'Foo:BarService' }), {
      cluster: 'hey',
    });

    expect(irq.body).to.eqls('BarService');
  });

  it('can send IRQ and get success IRS', async () => {
    await createCluster({ script: workerScript });
    const irq = await transfer(new IRQ({ to: 'Foo:BarService' }));

    expect(irq.body).to.eqls('BarService');
  });

  it('can wait for available thread to run', async () => {
    await createCluster({ script: workerScript, minThread: 2 });
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
      await createCluster({ script: workerScript });
      await transfer(new IRQ({ to: 'Foo:ErrorService' }));

      expect(true).to.false;
    } catch (err) {
      expect(err.body).to.eql('ErrorService');
    }
  });
});
