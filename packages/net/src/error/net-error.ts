import { ErrorCode } from './'

export class NetError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
  ) {
    super(message);
  }
}