import 'mocha';
import { expect } from 'chai';
import * as path from 'path';
import { createPool } from '../../src';
import { cleanAllPools, getPool } from '../../src/internal';
import { WorkerErrorCode } from '../../src/error/error-code';

const workerScript = path.resolve(
  __dirname,
  '../fixture/init-net-worker-empty.js'.replace('/', path.sep),
);

describe('createPool:', () => {
  afterEach(async () => {
    await cleanAllPools();
  });

  it('throw error if pool name is duplicated', async () => {
    try {
      await createPool({ script: workerScript });
      await createPool({ script: workerScript });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.PoolNameDuplicated);
    }

    try {
      await createPool({ script: workerScript, name: 'heyjude' });
      await createPool({ script: workerScript, name: 'heyjude' });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.PoolNameDuplicated);
    }
  });

  it('throw error if minThread < 1', async () => {
    try {
      await createPool({ script: workerScript, minThread: 0 });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.MinThread);
    }
  });

  it('throw error if createPool is invoked from child thread', async () => {
    const workerScript = path.resolve(
      __dirname,
      '../fixture/invoke-create-pool-from-child-thread.js'.replace(
        '/',
        path.sep,
      ),
    );

    try {
      await createPool({ script: workerScript });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.be.equal(WorkerErrorCode.CreatePoolFromChildThread);
    }
  });

  it('while creating worker, postMessage will be ignored', async () => {
    const workerScript = path.resolve(
      __dirname,
      '../fixture/post-message-while-create-worker.js'.replace('/', path.sep),
    );

    await createPool({ script: workerScript });
    const worker = await getPool().waitForIdleWorker();

    expect(worker).to.be.not.undefined;
  });

  it('if pool name is provided, it will use this name for new pool', async () => {
    await createPool({ script: workerScript });
    await createPool({ script: workerScript, name: 'hey jude' });

    expect(getPool()).to.be.not.undefined;
    expect(getPool('hey jude')).to.be.not.undefined;
  });
});
