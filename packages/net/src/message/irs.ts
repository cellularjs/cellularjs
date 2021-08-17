import { IrqHeader, IrsHeader, CellularIRQ } from "..";

/**
 * Cellular Internal Response
 */
export class CellularIRS {
  readonly header: IrsHeader = {
    status: 200000,
  };

  readonly body;

  constructor(
    body?: any,
    header: any = {},
  ) {
    this.header = {
      ...this.header,
      ...header,
    }

    this.body = body || {};
  }

  static unexpectedError(): CellularIRS {
    const unexpectedRrrorIrs = new CellularIRS(
      { error: 'Unexpected error has occurred' },
      { status: 500000 },
    );

    return unexpectedRrrorIrs;
  }
}