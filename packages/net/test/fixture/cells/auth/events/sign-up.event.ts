import { Service, ServiceHandler, IRQ, IRS, send } from '../../../../../src';

@Service({ scope: 'publish' })
export class SignUp implements ServiceHandler {
  constructor(private irq: IRQ) {}

  async handle(): Promise<IRS> {
    return new Promise(async (resolve) => {
      const createProfileIrq = new IRQ(
        { to: 'User:CreateProfile' },
        this.irq.body,
      );

      const createProfileIrs = await send(
        createProfileIrq.withHeaderItem('referer', this.irq.header.to),
      );

      resolve(createProfileIrs);
    });
  }
}

// Ignored when scanning folder for event handler because it is a variable.
export const DummyConst = 0;

// Ignored when scanning folder for event handler because it is not decorated by @Service.
export class SignIn {}
