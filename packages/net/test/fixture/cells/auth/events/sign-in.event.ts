import { Service, ServiceHandler, IRS } from '../../../../../src';

@Service({ scope: 'publish' })
export class SignIn implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS();
  }
}