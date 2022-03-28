import { WorkerErrorCode, WorkerError } from '.';
import { MINIMUM_WORKER } from '../internal';

export const Errors = {
  MinThread: () =>
    new WorkerError(
      `"minThread" must be >= ${MINIMUM_WORKER}`,
      WorkerErrorCode.MinThread,
    ),

  PoolNameDuplicated: (poolName: string | symbol) =>
    new WorkerError(
      `Pool name for "${String(poolName)}" is duplicated`,
      WorkerErrorCode.PoolNameDuplicated,
    ),

  PoolIsNotExists: (poolName: string | symbol) =>
    new WorkerError(
      `Pool named "${String(poolName)}" is not exists`,
      WorkerErrorCode.PoolIsNotExists,
    ),

  CreatePoolFromChildThread: () =>
    new WorkerError(
      `Can not create pool from child thread`,
      WorkerErrorCode.CreatePoolFromChildThread,
    ),

  TransferFromChildThread: () =>
    new WorkerError(
      `Using 'transfer' from child thread is not allowed`,
      WorkerErrorCode.TransferFromChildThread,
    ),

  InitNetWorkerFromMainThread: () =>
    new WorkerError(
      `Using 'initNetWorker' from main thread is not allowed`,
      WorkerErrorCode.InitNetWorkerFromMainThread,
    ),
};
