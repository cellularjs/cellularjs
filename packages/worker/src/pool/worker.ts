import { Worker as NodeJSWorker } from 'worker_threads';
import { WorkerStatus } from '../internal';

type WorkerStatusChangeCb = (status?: WorkerStatus) => void;

export class Worker {
  private _statusChangeCb: WorkerStatusChangeCb;

  private _status = WorkerStatus.IDLE;

  /**
   * @param _nodeJSWorker Original node.js worker thread instance.
   */
  constructor(private _nodeJSWorker: NodeJSWorker) {}

  /**
   * Get original node.js worker thread instance.
   */
  getNodeJsWorker() {
    return this._nodeJSWorker;
  }

  /**
   * Change worker status.
   */
  setStatus(status: WorkerStatus) {
    this._status = status;
    this._statusChangeCb(status);
  }

  /**
   * Get current worker status.
   */
  getStatus() {
    return this._status;
  }

  /**
   * Add listener for status changing.
   */
  onUpdateStatus(cb: WorkerStatusChangeCb) {
    this._statusChangeCb = cb;
  }

  /**
   * From Node.js: *Stop all JavaScript execution in the worker thread as soon as possible.
   * Returns a Promise for the exit code that is fulfilled when the `exit` event is emitted.*
   */
  terminate() {
    return this._nodeJSWorker.terminate();
  }
}
