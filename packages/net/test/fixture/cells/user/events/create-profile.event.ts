import { Inject } from '@cellularjs/di';
import {
  Service, ServiceHandler, CellularIRS, CellularIRQ, CLL_IRQ, CLL_CELL_CTX, send,
} from '../../../../../src';
import { CreateProfileReq } from '../services/create-profile.req';

@Service({ scope: 'public' })
export class CreateProfile implements ServiceHandler {
  constructor(
    @Inject(CLL_IRQ) private irq: CellularIRQ,
    @Inject(CLL_CELL_CTX) private ctx,
    private createProfileReq: CreateProfileReq,
  ) { }

  async handle() {
    if (this.irq.body.shouldThrow) {
      throw new CellularIRS({ status: 400000 });
    }

    const sendMailIrq = new CellularIRQ({ unicast: 'User:SendMail' });
    await send(sendMailIrq, { refererCell: this.ctx })

    return new CellularIRS(
      { newUser: this.createProfileReq.usr },
    );
  }
}