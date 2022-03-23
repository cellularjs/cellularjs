import 'mocha';
import { expect } from 'chai';
import * as path from 'path';
import { createCluster } from '../../src';
import { cleanAllClusters, getPool } from '../../src/internal';
import { WorkerErrorCode } from '../../src/error/error-code';

const workerScript = path.resolve(
  __dirname,
  '../fixture/init-net-worker-empty.js'.replace('/', path.sep),
);

describe('createCluster:', () => {
  afterEach(async () => {
    await cleanAllClusters();
  });

  it('throw error if cluster name is duplicated', async () => {
    try {
      await createCluster({ script: workerScript });
      await createCluster({ script: workerScript });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.ClusterNameDuplicated);
    }

    try {
      await createCluster({ script: workerScript, name: 'heyjude' });
      await createCluster({ script: workerScript, name: 'heyjude' });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.ClusterNameDuplicated);
    }
  });

  it('throw error if minThread < 1', async () => {
    try {
      await createCluster({ script: workerScript, minThread: 0 });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.MinThread);
    }
  });

  it('throw error if createCluster is invoked from child thread', async () => {
    const workerScript = path.resolve(
      __dirname,
      '../fixture/invoke-create-cluster-from-child-thread.js'.replace(
        '/',
        path.sep,
      ),
    );

    try {
      await createCluster({ script: workerScript });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(
        WorkerErrorCode.CreateClusterFromChildThread,
      );
    }
  });

  it('while creating worker, postMessage will be ignored', async () => {
    const workerScript = path.resolve(
      __dirname,
      '../fixture/post-message-while-create-worker.js'.replace('/', path.sep),
    );

    await createCluster({ script: workerScript });
    const worker = await getPool().waitForIdleWorker();

    expect(worker).to.be.not.undefined;
  });

  it('if cluster name is provided, it will use this name for new cluster', async () => {
    await createCluster({ script: workerScript });
    await createCluster({ script: workerScript, name: 'hey jude' });

    expect(getPool()).to.be.not.undefined;
    expect(getPool('hey jude')).to.be.not.undefined;
  });
});
