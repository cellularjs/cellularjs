import { Inject } from '@cellularjs/di';
import {
  Service, ServiceHandler, IRQ, IRS, CLL_IRQ, CellContext, send,
} from '../../../../../src';

@Service({ scope: 'public' })
export class SignUp implements ServiceHandler {
  constructor(
    @Inject(CLL_IRQ) private irq: IRQ,
    private ctx: CellContext,
  ) { }

  async handle(): Promise<IRS> {
    return new Promise(async resolve => {
      const createProfileIrq = new IRQ(
        { to: 'User:CreateProfile' },
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