import { NetErrorCode } from './'

export class NetError extends Error {
  constructor(
    message: string,
    public code: NetErrorCode,
  ) {
    super(message);
  }
}