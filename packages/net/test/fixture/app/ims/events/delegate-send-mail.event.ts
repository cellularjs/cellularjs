import {
  Service,
  ServiceHandler,
  IRQ,
  IRS,
  CellContext,
  send,
} from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateSendMail implements ServiceHandler {
  constructor(private ctx: CellContext) {}

  async handle(): Promise<IRS> {
    const irq = new IRQ({ to: 'Mailer:SendMail' });

    const createProfileIrs = await send(
      irq.withHeaderItem('referer', this.ctx.cellName),
      { throwOriginalError: true },
    );

    return createProfileIrs;
  }
}
