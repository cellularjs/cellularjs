import { IrqHeader } from '..';

/**
 * Cellular Internal Request
 */
export class IRQ {
  public readonly header: IrqHeader;
  public readonly body;

  /**
   * @param header  
   * - to(string): destination request will go
   */
  constructor(header: IrqHeader, body?: { [key: string]: any }) {
    this.header = header;
    this.body = body || {};
  }
}