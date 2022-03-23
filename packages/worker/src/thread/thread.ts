import { isMainThread, parentPort } from 'worker_threads';

/**
 * For internal use only.
 */
export class Thread {
  static isMainThread = isMainThread;

  static parentPort = parentPort;
}
