import { Inject } from '@cellularjs/di';
import { Service, ServiceHandler, send, IRQ, CLL_CELL_CTX } from '../../../../../src';

@Service({ scope: 'public' })
export class DelegateSignIn implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx,
  ) { }

  handle() {
    const signInIrq = new IRQ({ to: 'Auth:SignIn' });

    return send(signInIrq, { refererCell: this.ctx });
  }
}