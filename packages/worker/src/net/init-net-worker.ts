import { NetworkConfig, createNetWork } from '@cellularjs/net';
import { Thread, Errors, MessageType } from '../internal';
import { taskHandler } from './task-handler';

export async function initNetWorker(netCnf: NetworkConfig) {
  if (Thread.isMainThread) {
    throw Errors.InitNetWorkerFromMainThread();
  }

  Thread.parentPort.on('message', taskHandler);

  await createNetWork(netCnf);

  Thread.parentPort.postMessage({
    type: MessageType.READY,
  });
}
