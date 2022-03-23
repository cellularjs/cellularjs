import { IRQ, IRS } from '@cellularjs/net';
import {
  getPool,
  MessageType,
  WorkerMessage,
  WorkerStatus,
  Thread,
} from '../internal';
import { Worker } from '../pool';
import { Errors } from '../error';
import { DEFAULT_CLUSTER } from '../const';

interface TransferOptions {
  /**
   * The name of cluster that you want to transfer irq message.
   *
   * If there is no cluster is specified, it will use default cluster name.
   */
  cluster?: string;

  // transferList
}

/**
 * Transfer `IRQ` and get `IRS`
 */
export async function transfer(
  irq: IRQ,
  options?: TransferOptions,
): Promise<IRS> {
  if (!Thread.isMainThread) {
    throw Errors.TransferFromChildThread();
  }

  const clusterName = options?.cluster || DEFAULT_CLUSTER;
  const pool = getPool(clusterName);

  if (!pool) {
    throw Errors.ClusterIsNotExists(clusterName);
  }

  const worker = await pool.waitForIdleWorker();

  return new Promise((resolve, reject) =>
    messageHandler(resolve, reject, worker, irq),
  );
}

function messageHandler(resolve, reject, worker, irq) {
  const nodeJsWorker = worker.getNodeJsWorker();

  nodeJsWorker.on('message', function (msg: WorkerMessage<IRS>) {
    const channel = msgChannels(resolve, reject, worker)[msg.type];
    channel(msg);
  });

  const postMsg: WorkerMessage<IRQ> = {
    type: MessageType.TASK,
    payload: irq,
  };

  nodeJsWorker.postMessage(postMsg);
}

const msgChannels = (resolve, reject, worker: Worker) => ({
  // [MessageType.HOOK]: (msg: WorkerMessage<IRS>) => {
  //   WorkerHook.runHook(msg.data.hook, msg.data.hookData);
  // },

  // [MessageType.TASK]: (msg: WorkerMessage<IRS>) => {
  //   WorkerHook.runTask('send_via_thread', msg);
  // },

  [MessageType.ERROR]: (msg: WorkerMessage<IRS>) => {
    worker.setStatus(WorkerStatus.IDLE);

    reject(msg.payload);
  },

  [MessageType.DONE]: (msg: WorkerMessage<IRS>) => {
    worker.getNodeJsWorker().removeAllListeners('message');

    worker.setStatus(WorkerStatus.IDLE);

    resolve(msg.payload);
  },
});
