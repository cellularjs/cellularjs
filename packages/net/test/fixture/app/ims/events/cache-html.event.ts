import { Service, ServiceHandler, IRS } from '../../../../../src';

@Service({ scope: 'private' })
export class CacheHtml implements ServiceHandler {
  async handle(): Promise<IRS> {
    return new IRS({
      cached: true,
    });
  }
}