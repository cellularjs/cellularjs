import { Service, ServiceHandler, IRS } from '../../../../../../../src';

@Service()
export class LockAccount implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS();
  }
}