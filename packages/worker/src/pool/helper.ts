import { Worker as NodeJSWorker } from 'worker_threads';
import { MessageType, Thread, Pool, Worker, WorkerMessage } from '../internal';
import { Errors } from '../error';
import { DEFAULT_POOL, MINIMUM_WORKER } from '../const';

const pools = new Map<string | symbol, Pool>();

interface PoolOptions {
  /**
   * Unique pool name.
   *
   * If pool name is not provided, CellularJS will give it a default name.
   */
  name?: string;

  /**
   * Default: 1.
   */
  minThread?: number;

  /**
   * Path to worker script.
   */
  script: string;

  // resourceLimits?: ResourceLimits;
}

/**
 * Create thread pool for specific worker script.
 *
 * After pool is initialized, you can use `transfer` to exchange message.
 *
 * @see https://cellularjs.com/docs/foundation/worker/usage#2-transfer-irq-to-net-worker.
 */
export async function createPool(options: PoolOptions) {
  if (!Thread.isMainThread) throw Errors.CreatePoolFromChildThread();

  options.minThread = Number.isInteger(options.minThread)
    ? options.minThread
    : MINIMUM_WORKER;

  if (options.minThread < MINIMUM_WORKER) {
    throw Errors.MinThread();
  }

  const poolName = options.name || DEFAULT_POOL;
  if (pools.has(poolName)) {
    throw Errors.PoolNameDuplicated(poolName);
  }

  pools.set(poolName, await createWorkerPool(options));
}

async function createWorkerPool(options: PoolOptions) {
  const pool = new Pool();

  for (let i = 0; i < options.minThread; i++) {
    const worker = await createNetWorker(options);
    pool.addWorker(worker);
  }

  return pool;
}

function createNetWorker(options: PoolOptions): Promise<Worker> {
  return new Promise((resolve, reject) => {
    const nodeJsWorker = new NodeJSWorker(options.script);

    nodeJsWorker.on('message', (msg: WorkerMessage) => {
      if (msg.type !== MessageType.READY) {
        return;
      }

      nodeJsWorker.removeAllListeners('message');
      resolve(new Worker(nodeJsWorker));
    });

    // It can listen to worker error thank to this issue:
    // https://github.com/nodejs/node/issues/33834
    nodeJsWorker.once('error', reject);
  });
}

export function getPool(poolName: string = DEFAULT_POOL) {
  return pools.get(poolName);
}

export async function cleanAllPools() {
  const poolArr = Array.from(pools);

  for (let i = 0; i < poolArr.length; i++) {
    const [poolName, pool] = poolArr[i];

    pool && (await pool.drain());
    pools.delete(poolName);
  }
}
