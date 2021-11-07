import { Inject } from '@cellularjs/di';
import {
  Service, ServiceHandler, IRQ, IRS,
  CellContext, CLL_IRQ, send,
} from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateSendMail implements ServiceHandler {
  constructor(
    private ctx: CellContext,
    @Inject(CLL_IRQ) private irq: IRQ,
  ) {}

  async handle(): Promise<IRS> {
    const irq = new IRQ(
      { to: 'User:SendMail' },
    );

    const createProfileIrs = await send(irq, { refererCell: this.ctx, throwOriginalError: true });

    return createProfileIrs;
  }
}
