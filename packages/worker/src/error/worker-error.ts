import { WorkerErrorCode } from '.';

export class WorkerError extends Error {
  constructor(message: string, public code: WorkerErrorCode) {
    super(message);
  }
}
