import { Service, ServiceHandler, IRS } from '../../../../../src';

@Service()
export class UnlockAccount implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS();
  }
}