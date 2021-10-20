import { Inject } from '@cellularjs/di';
import {
  Service, ServiceHandler, CellularIRQ, CellularIRS, CLL_IRQ, send, CLL_CELL_CTX,
} from '../../../../../src';

@Service({ scope: 'public' })
export class SignUp implements ServiceHandler {
  constructor(
    @Inject(CLL_IRQ) private irq: CellularIRQ,
    @Inject(CLL_CELL_CTX) private ctx,
  ) { }

  async handle(): Promise<CellularIRS> {
    return new Promise(async resolve => {
      const createProfileIrq = new CellularIRQ(
        { unicast: 'User:CreateProfile' },
        this.irq.body,
      );

      const createProfileIrs = await send(createProfileIrq, {
        refererCell: this.ctx,
      });

      resolve(createProfileIrs)
    });
  }
}

// Ignored when scanning folder for event handler
export const DummyConst = 0;

// Ignored when scanning folder for event handler
export class SignIn { }