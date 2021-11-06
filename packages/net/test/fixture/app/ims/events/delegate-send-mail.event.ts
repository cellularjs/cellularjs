import { Inject } from '@cellularjs/di';
import {
  Service, ServiceHandler, IRQ, IRS,
  CellContext, CLL_CELL_CTX, CLL_IRQ, send,
} from '../../../../../src';

@Service({ scope: 'public' })
export class DelegateSendMail implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx: CellContext,
    @Inject(CLL_IRQ) private irq: IRQ,
  ) {}

  async handle(): Promise<IRS> {
    const irq = new IRQ(
      { to: 'User:SendMail' },
    );

    const createProfileIrs = await send(irq, { refererCell: this.ctx, throwOnError: true });

    return createProfileIrs;
  }
}
