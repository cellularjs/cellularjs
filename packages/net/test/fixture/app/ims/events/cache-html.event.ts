import { Service, ServiceHandler, CellularIRS } from '../../../../../src';

@Service({ scope: 'private' })
export class CacheHtml implements ServiceHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS({
      cached: true,
    });
  }
}