import { Injectable } from '@cellularjs/di';
import { IRQ, IRS } from '../../../../../src';

@Injectable()
export class DummySignInReq {
  public readonly usr;
  public readonly pwd;

  constructor(irq: IRQ) {
    if (!irq.body.usr || !irq.body.pwd) {
      throw new IRS({ status: 400 });
    }

    Object.assign(this, irq.body);
  }
}