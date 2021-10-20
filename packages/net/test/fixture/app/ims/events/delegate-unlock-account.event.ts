import { Inject } from '@cellularjs/di';
import { Service, ServiceHandler, CellularIRQ, CellContext, CLL_CELL_CTX, send } from '../../../../../src';

@Service({ scope: 'public' })
export class DelegateUnlockAccount implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx: CellContext,
  ) {}

  handle() {
    const delegateUnlockAccountIrq = new CellularIRQ(
      { unicast: 'Auth:UnlockAccount' },
    );

    return send(delegateUnlockAccountIrq, { refererCell: this.ctx, throwOnError: true });
  }
}
