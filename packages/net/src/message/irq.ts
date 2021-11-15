import { IrqHeader } from '../internal';
import { Message } from './message';

/**
 * Cellular Internal Request
 */
export class IRQ implements Message {
  public readonly header: IrqHeader;
  public readonly body;

  /**
   * @param header  
   * - to(string): destination request will go
   */
  constructor(header: IrqHeader, body?: { [key: string]: any }) {
    this.header = header || {};
    this.body = body || {};
  }

  withHeader(newHeader) {
    return new IRQ(newHeader, this.body);
  }

  withHeaderItem(k, v) {
    const newHeader = {
      ...this.header,
      [k]: v,
    }
    return new IRQ(newHeader, this.body);
  }

  withBody(newBody) {
    return new IRQ(this.header, newBody);
  }
}