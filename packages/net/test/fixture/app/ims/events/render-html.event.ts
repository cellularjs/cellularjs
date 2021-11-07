import { Service, ServiceHandler, CellContext, send, IRS, IRQ } from '../../../../../src';

@Service({
  scope: 'publish',
})
export class RenderHtml implements ServiceHandler {
  constructor(
    private ctx: CellContext,
  ) { }

  handle(): Promise<IRS> {
    const cacheHtmlIrq = new IRQ(
      { to: 'IMS:CacheHtml' },
    );

    return send(cacheHtmlIrq, { refererCell: this.ctx });
  }
}