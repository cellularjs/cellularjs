import {
  Service, ServiceHandler, IRS, IRQ, CellContext, send,
} from '../../../../../src';
import { CreateProfileReq } from '../services/create-profile.req';

@Service({ scope: 'publish' })
export class CreateProfile implements ServiceHandler {
  constructor(
    private irq: IRQ,
    private ctx: CellContext,
    private createProfileReq: CreateProfileReq,
  ) { }

  async handle() {
    if (this.irq.body.shouldThrow) {
      throw new IRS({ status: 400 });
    }

    const sendMailIrq = new IRQ({ to: 'User:SendMail' });
    await send(sendMailIrq, { refererCell: this.ctx })

    return { newUser: this.createProfileReq.usr };
  }
}