import { IrqHeader } from '../internal';
import { Message } from './message';

/**
 * Cellular Internal Request
 */
export class IRQ implements Message {
  public readonly body: any;

  /**
   * @param header
   * - to(string): destination request will go
   */
  constructor(public readonly header: IrqHeader, body?: any) {
    this.body = body === undefined ? {} : body;
  }

  withHeader(newHeader) {
    return new IRQ(newHeader, this.body);
  }

  withHeaderItem(k, v) {
    const newHeader = {
      ...this.header,
      [k]: v,
    };
    return new IRQ(newHeader, this.body);
  }

  withBody(newBody) {
    return new IRQ(this.header, newBody);
  }
}
