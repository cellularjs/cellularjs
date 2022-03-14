import { Service, ServiceHandler, send, IRQ } from '../../../../../src';

@Service({ scope: 'publish' })
export class DelegateCacheHtml implements ServiceHandler {
  constructor(private irq: IRQ) {}

  handle() {
    const cacheHtmlIrq = new IRQ({ to: 'IMS:CacheHtml' });

    return send(cacheHtmlIrq.withHeaderItem('referer', this.irq.header.to), {
      throwOriginalError: true,
    });
  }
}
