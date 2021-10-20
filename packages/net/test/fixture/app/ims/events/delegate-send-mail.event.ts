import { Inject } from '@cellularjs/di';
import {
  Service, ServiceHandler, CellularIRQ, CellularIRS,
  CellContext, CLL_CELL_CTX, CLL_IRQ, send,
} from '../../../../../src';

@Service({ scope: 'public' })
export class DelegateSendMail implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx: CellContext,
    @Inject(CLL_IRQ) private irq: CellularIRQ,
  ) {}

  async handle(): Promise<CellularIRS> {
    const irq = new CellularIRQ(
      { unicast: 'User:SendMail' },
    );

    const createProfileIrs = await send(irq, { refererCell: this.ctx, throwOnError: true });

    return createProfileIrs;
  }
}
