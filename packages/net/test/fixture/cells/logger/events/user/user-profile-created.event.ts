import { Service, ServiceHandler, IRS } from '../../../../../../src';

@Service({
  route: 'multicast',
})
export class UserProfileCreated implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS();
  }
}