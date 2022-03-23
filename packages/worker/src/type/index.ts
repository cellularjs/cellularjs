export enum WorkerStatus {
  BUSY,
  IDLE,
}

export enum MessageType {
  /**
   * Ready.
   */
  READY = 'READY',

  /**
   * Stop, resolve.
   */
  DONE = 'DONE',

  /**
   * Stop, reject.
   */
  ERROR = 'ERROR',

  // /**
  //  * Run hook.
  //  */
  // HOOK = 'HOOK',

  /**
   * Run task.
   */
  TASK = 'TASK',
}

export interface WorkerMessage<Payload = any> {
  type: MessageType;
  payload?: Payload;
}
