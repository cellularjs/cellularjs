import { IrsHeader } from '../internal';
import { Message } from './message';

/**
 * Cellular Internal Response
 */
export class IRS implements Message {
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
    this.body = body;
  }

  withHeader(newHeader: IrsHeader) {
    return new IRS(this.body, newHeader);
  }

  withHeaderItem(k: keyof IrsHeader, v): IRS {
    const newHeader = {
      ...this.header,
      [k]: v,
    };

    return new IRS(this.body, newHeader);
  }

  withBody(newBody) {
    return new IRS(newBody, this.header);
  }

  static unexpectedError(): IRS {
    const unexpectedRrrorIrs = new IRS(
      undefined,
      { status: 500 },
    );

    return unexpectedRrrorIrs;
  }
}