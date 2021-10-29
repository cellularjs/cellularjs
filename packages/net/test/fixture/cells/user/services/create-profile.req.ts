import { Injectable, Inject } from '@cellularjs/di';
import { CLL_IRQ, IRQ, IRS } from '../../../../../src';

@Injectable()
export class CreateProfileReq {
  public readonly usr;
  public readonly pwd;

  constructor(
    @Inject(CLL_IRQ) irq: IRQ,
  ) {
    if (!irq.body.usr || !irq.body.pwd) {
      throw new IRS(null, { status: 400000 });
    }

    Object.assign(this, irq.body);
  }
}
