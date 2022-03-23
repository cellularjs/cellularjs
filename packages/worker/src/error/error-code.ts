export enum WorkerErrorCode {
  MinThread = 'MIN_THREAD',
  ClusterNameDuplicated = 'DUPLICATE_CLUSTER_NAME',
  ClusterIsNotExists = 'CLUSER_IS_NOT_EXISTS',
  CreateClusterFromChildThread = 'CREATE_CLUSTER_FROM_CHILD_THREAD',
  TransferFromChildThread = 'TRANSFER_FROM_CHILD_THREAD',
  InitNetWorkerFromMainThread = 'INIT_NET_WORKER_FROM_MAIN_THREAD',
}
