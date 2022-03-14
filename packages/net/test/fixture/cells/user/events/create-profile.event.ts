import { Service, ServiceHandler, IRQ, send } from '../../../../../src';
import { CreateProfileReq } from '../services/create-profile.req';

@Service({ scope: 'publish' })
export class CreateProfile implements ServiceHandler {
  constructor(private irq: IRQ, private createProfileReq: CreateProfileReq) {}

  async handle() {
    const sendMailIrq = new IRQ({ to: 'Mailer:SendMail' });
    await send(sendMailIrq.withHeaderItem('referer', this.irq.header.to));

    return { newUser: this.createProfileReq.usr };
  }
}
