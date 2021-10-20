import { Service, ServiceHandler, CellularIRS } from '../../../../../../src';

@Service({
  route: 'multicast',
})
export class UserProfileCreated implements ServiceHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}