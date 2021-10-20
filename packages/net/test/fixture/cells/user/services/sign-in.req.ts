import { Injectable, Inject } from '@cellularjs/di';
import { CLL_IRQ, CellularIRQ, CellularIRS } from '../../../../../src';

@Injectable()
export class DummySignInReq {
  public readonly usr;
  public readonly pwd;

  constructor(
    @Inject(CLL_IRQ) irq: CellularIRQ,
  ) {
    if (!irq.body.usr || !irq.body.pwd) {
      throw new CellularIRS(null, { status: 400000 });
    }

    Object.assign(this, irq.body);
  }
}