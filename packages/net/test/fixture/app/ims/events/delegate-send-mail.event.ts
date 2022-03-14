import { Service, ServiceHandler, IRQ, IRS, send } from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateSendMail implements ServiceHandler {
  constructor(private irq: IRQ) {}

  async handle(): Promise<IRS> {
    const irq = new IRQ({ to: 'Mailer:SendMail' });

    const createProfileIrs = await send(
      irq.withHeaderItem('referer', this.irq.header.to),
      { throwOriginalError: true },
    );

    return createProfileIrs;
  }
}
