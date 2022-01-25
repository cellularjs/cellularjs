import {
  Service,
  ServiceHandler,
  IRQ,
  CellContext,
  send,
} from '../../../../../src';
import { CreateProfileReq } from '../services/create-profile.req';

@Service({ scope: 'publish' })
export class CreateProfile implements ServiceHandler {
  constructor(
    private ctx: CellContext,
    private createProfileReq: CreateProfileReq,
  ) {}

  async handle() {
    const sendMailIrq = new IRQ({ to: 'Mailer:SendMail' });
    await send(sendMailIrq.withHeaderItem('referer', this.ctx.cellName));

    return { newUser: this.createProfileReq.usr };
  }
}
