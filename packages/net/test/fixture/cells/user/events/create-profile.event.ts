import {
  Service, ServiceHandler, IRQ, CellContext, send,
} from '../../../../../src';
import { CreateProfileReq } from '../services/create-profile.req';

@Service({ scope: 'publish' })
export class CreateProfile implements ServiceHandler {
  constructor(
    private ctx: CellContext,
    private createProfileReq: CreateProfileReq,
  ) { }

  async handle() {
    const sendMailIrq = new IRQ({ to: 'User:SendMail' });
    await send(sendMailIrq, { refererCell: this.ctx })

    return { newUser: this.createProfileReq.usr };
  }
}