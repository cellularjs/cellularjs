import { Service, ServiceHandler } from '../../../../../src';

@Service({ scope: 'publish' })
export class SignIn implements ServiceHandler {
  async handle() {}
}
