import { Inject } from '@cellularjs/di';
import { Service, ServiceHandler, send, IRS, IRQ, CLL_CELL_CTX } from '../../../../../src';

@Service({
  scope: 'public',
})
export class RenderHtml implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx,
  ) { }

  handle(): Promise<IRS> {
    const cacheHtmlIrq = new IRQ(
      { to: 'IMS:CacheHtml' },
    );

    return send(cacheHtmlIrq, { refererCell: this.ctx });
  }
}