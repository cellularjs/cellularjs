import { Service, ServiceHandler, send, IRQ } from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateSignIn implements ServiceHandler {
  constructor(private irq: IRQ) {}

  handle() {
    const signInIrq = new IRQ({ to: 'Auth:SignIn' });

    return send(signInIrq.withHeaderItem('referer', this.irq.header.to));
  }
}
