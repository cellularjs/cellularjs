export enum WorkerErrorCode {
  MinThread = 'MIN_THREAD',
  PoolNameDuplicated = 'DUPLICATE_POOL_NAME',
  PoolIsNotExists = 'CLUSER_IS_NOT_EXISTS',
  CreatePoolFromChildThread = 'CREATE_POOL_FROM_CHILD_THREAD',
  TransferFromChildThread = 'TRANSFER_FROM_CHILD_THREAD',
  InitNetWorkerFromMainThread = 'INIT_NET_WORKER_FROM_MAIN_THREAD',
}
