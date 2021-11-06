import { Inject } from '@cellularjs/di';
import { Service, ServiceHandler, send, IRQ, CellContext } from '../../../../../src';

@Service({ scope: 'public' })
export class DelegateSignIn implements ServiceHandler {
  constructor(
    private ctx: CellContext,
  ) { }

  handle() {
    const signInIrq = new IRQ({ to: 'Auth:SignIn' });

    return send(signInIrq, { refererCell: this.ctx });
  }
}