import { Worker as NodeJSWorker } from 'worker_threads';
import { MessageType, Thread, Pool, Worker, WorkerMessage } from '../internal';
import { Errors } from '../error';
import { DEFAULT_CLUSTER, MINIMUM_WORKER } from '../const';

const clusters = new Map<string | symbol, Pool>();

interface ClusterOptions {
  /**
   * Unique cluster name.
   *
   * If cluster name is not provided, CellularJS will give it a default name.
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

export async function createCluster(options: ClusterOptions) {
  if (!Thread.isMainThread) throw Errors.CreateClusterFromChildThread();

  options.minThread = Number.isInteger(options.minThread)
    ? options.minThread
    : MINIMUM_WORKER;

  if (options.minThread < MINIMUM_WORKER) {
    throw Errors.MinThread();
  }

  const clusterName = options.name || DEFAULT_CLUSTER;
  if (clusters.has(clusterName)) {
    throw Errors.ClusterNameDuplicated(clusterName);
  }

  clusters.set(clusterName, await createWorkerPool(options));
}

async function createWorkerPool(options: ClusterOptions) {
  const pool = new Pool();

  for (let i = 0; i < options.minThread; i++) {
    const worker = await createNetWorker(options);
    pool.addWorker(worker);
  }

  return pool;
}

function createNetWorker(options: ClusterOptions): Promise<Worker> {
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

export function getPool(clusterName: string = DEFAULT_CLUSTER) {
  return clusters.get(clusterName);
}

export async function cleanAllClusters() {
  const clusterArr = Array.from(clusters);

  for (let i = 0; i < clusterArr.length; i++) {
    const [clusterName, pool] = clusterArr[i];

    pool && (await pool.drain());
    clusters.delete(clusterName);
  }
}
