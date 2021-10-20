import { Service, ServiceHandler, CellularIRS } from '../../../../../src';

@Service()
export class UnlockAccount implements ServiceHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}