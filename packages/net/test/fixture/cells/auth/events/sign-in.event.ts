import { Service, ServiceHandler, IRS } from '../../../../../src';

@Service({ scope: 'public' })
export class SignIn implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS();
  }
}