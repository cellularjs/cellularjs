/**
 * Internal Request
 */
export class CellularIRQ {
  readonly header: {
    to: string,
    broad: string,
    [key: string]: any,
  };

  /**
   * @param header  
   * - to(string): destination request will go
   */
  constructor(
    header: any,
    readonly body?: any
  ) {
    this.header = header;
  }

  getReqId() {
    return this.header.id;
  }

  setReqId(id) {
    this.header.id = id;
  }
}

/**
 * Internal Response
 */
export class CellularIRS {
  readonly header: {
    status: number,
    [key: string]: any,
  } = {
      status: 200000,
    };

  constructor(
    readonly body?: any,
    header: any = {},
  ) {
    this.header = {
      ...this.header,
      ...header,
    }
  }

  static standardIrsError(errorIrs: CellularIRS, irq: CellularIRQ) {
    errorIrs.setReqId(irq.getReqId());
    return errorIrs;
  }

  static standardUnexpectedError(irq: CellularIRQ) {
    const unexpectedRrrorIrs = new CellularIRS(
      { error: 'Unexpected error has occurs' },
      { status: 500000 },
    );

    unexpectedRrrorIrs.setReqId(irq.getReqId());

    return unexpectedRrrorIrs;
  }

  setReqId(id) {
    this.body.id = id;
  }
}