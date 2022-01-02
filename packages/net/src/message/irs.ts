import { IrsHeader } from '../internal';
import { Message } from './message';

/**
 * Cellular Internal Response
 */
export class IRS implements Message {
  readonly header: IrsHeader = {
    status: 200,
  };

  readonly body;

  constructor(header: IrsHeader = {} as IrsHeader, body?: any) {
    this.header = {
      ...this.header,
      ...header,
    };
    this.body = body;
  }

  withHeader(newHeader: IrsHeader) {
    return new IRS(newHeader, this.body);
  }

  withHeaderItem(k: keyof IrsHeader, v): IRS {
    const newHeader = {
      ...this.header,
      [k]: v,
    };

    return new IRS(newHeader, this.body);
  }

  withBody(newBody) {
    return new IRS(this.header, newBody);
  }

  static unexpectedError(): IRS {
    const unexpectedRrrorIrs = new IRS({ status: 500 });

    return unexpectedRrrorIrs;
  }
}
