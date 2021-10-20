import { Service, ServiceHandler, CellularIRS } from '../../../../../src';

@Service({ scope: 'public' })
export class SignIn implements ServiceHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}