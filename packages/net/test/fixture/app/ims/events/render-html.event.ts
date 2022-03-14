import { Service, ServiceHandler, send, IRS, IRQ } from '../../../../../src';

@Service({
  scope: 'publish',
})
export class RenderHtml implements ServiceHandler {
  constructor(private irq: IRQ) {}

  handle(): Promise<IRS> {
    const cacheHtmlIrq = new IRQ({ to: 'IMS:CacheHtml' });

    return send(cacheHtmlIrq.withHeaderItem('referer', this.irq.header.to));
  }
}
