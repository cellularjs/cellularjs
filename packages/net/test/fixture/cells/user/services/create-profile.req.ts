import { Injectable } from '@cellularjs/di';
import { IRS, IRQ } from '../../../../../src';

@Injectable()
export class CreateProfileReq {
  public readonly usr;
  public readonly pwd;

  constructor(irq: IRQ) {
    if (!irq.body.usr || !irq.body.pwd) {
      throw new IRS(null, { status: 400 });
    }

    Object.assign(this, irq.body);
  }
}
