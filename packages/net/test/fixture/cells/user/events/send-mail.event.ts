import { Service, ServiceHandler, IRS } from '../../../../../src';

@Service({ scope: 'space' })
export class SendMail implements ServiceHandler {
  handle() {
    return new IRS();
  }
}