import { WorkerStatus } from '../internal';
import { SubjectQueue } from './subject-queue';
import { Observer } from './observer';
import { Worker } from './worker';

export class Pool {
  private _pool: Worker[] = [];
  private _subjectQueue = new SubjectQueue<Worker>();

  /**
   * Add worker into pool.
   */
  addWorker(worker: Worker): void {
    this._pool.push(worker);

    worker.onUpdateStatus((status) => {
      if (status === WorkerStatus.BUSY) {
        return;
      }

      this._subjectQueue.notify(worker);
    });
  }

  /**
   * Waiting for idle CellularJS Worker.
   */
  async waitForIdleWorker(): Promise<Worker> {
    const idleWorker = this.getIdleWorker();

    if (idleWorker) {
      idleWorker.setStatus(WorkerStatus.BUSY);
      return idleWorker;
    }

    return new Promise((resolve) => {
      const obs = new Observer<Worker>();
      obs.subcribe((worker) => {
        worker.setStatus(WorkerStatus.BUSY);
        resolve(worker);
      });

      this._subjectQueue.addObserver(obs);
    });
  }

  async drain() {
    return Promise.all(this._pool.map((worker) => worker.terminate()));
  }

  private getIdleWorker(): Worker | undefined {
    return this._pool.find(
      (worker) => worker.getStatus() === WorkerStatus.IDLE,
    );
  }
}
