import { Inject } from '@cellularjs/di';
import { Service, ServiceHandler, IRS, IRQ, CLL_IRQ } from '../../../../../../src';

@Service({
  scope: 'space',
})
export class WriteLog implements ServiceHandler {
  constructor(
    @Inject(CLL_IRQ) private irq: IRQ,
  ) { }

  handle() {
    return new IRS({ ...this.irq.body, writeLog: true });
  }
}