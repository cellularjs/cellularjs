import { Service, ServiceHandler, IRQ, send } from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateUnlockAccount implements ServiceHandler {
  constructor(private irq: IRQ) {}

  handle() {
    const delegateUnlockAccountIrq = new IRQ({ to: 'Auth:UnlockAccount' });

    return send(
      delegateUnlockAccountIrq.withHeaderItem('referer', this.irq.header.to),
      { throwOriginalError: true },
    );
  }
}
