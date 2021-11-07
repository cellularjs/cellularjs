import { Service, ServiceHandler, IRQ, CellContext, send } from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateUnlockAccount implements ServiceHandler {
  constructor(
    private ctx: CellContext,
  ) {}

  handle() {
    const delegateUnlockAccountIrq = new IRQ(
      { to: 'Auth:UnlockAccount' },
    );

    return send(delegateUnlockAccountIrq, { refererCell: this.ctx, throwOriginalError: true });
  }
}
