import { Service, ServiceHandler } from '../../../../../src';

@Service({ scope: 'space' })
export class SendMail implements ServiceHandler {
  handle() {}
}
