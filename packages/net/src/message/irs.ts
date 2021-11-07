import { IrsHeader } from '..';

/**
 * Cellular Internal Response
 */
export class IRS {
  readonly header: IrsHeader = {
    status: 200000,
  };

  readonly body;

  constructor(
    body?: any,
    header: IrsHeader = {} as IrsHeader,
  ) {
    this.header = {
      ...this.header,
      ...header,
    }

    this.body = body || {};
  }

  static unexpectedError(): IRS {
    const unexpectedRrrorIrs = new IRS(
      undefined,
      { status: 500 },
    );

    return unexpectedRrrorIrs;
  }
}