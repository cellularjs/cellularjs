import { Service, ServiceHandler, IRS } from '../../../../../src';

@Service()
export class DummyService implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS();
  }
}
