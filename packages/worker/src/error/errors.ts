import { WorkerErrorCode, WorkerError } from '.';
import { MINIMUM_WORKER } from '../internal';

export const Errors = {
  MinThread: () =>
    new WorkerError(
      `"minThread" must be >= ${MINIMUM_WORKER}`,
      WorkerErrorCode.MinThread,
    ),

  ClusterNameDuplicated: (clusterName: string | symbol) =>
    new WorkerError(
      `Cluster name for "${String(clusterName)}" is duplicated`,
      WorkerErrorCode.ClusterNameDuplicated,
    ),

  ClusterIsNotExists: (clusterName: string | symbol) =>
    new WorkerError(
      `Cluster named "${String(clusterName)}" is not exists`,
      WorkerErrorCode.ClusterIsNotExists,
    ),

  CreateClusterFromChildThread: () =>
    new WorkerError(
      `Can not create cluster from child thread`,
      WorkerErrorCode.CreateClusterFromChildThread,
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
