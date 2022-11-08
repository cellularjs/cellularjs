import { Container } from '../container';
import { UseProxyResolverMeta } from '../core-resolver/use-proxy.resolver';
import { Provider, ResolveOptions } from '../internal';
import { ProxyContext } from './proxy-context';
import { ProxyHandler } from './type';

export class ProxyRunner {
  private index: number;

  constructor(
    private container: Container,
    private provider: Provider<UseProxyResolverMeta>,
    private options: ResolveOptions,
  ) {
    this.index = provider.meta.proxiesCnfs.length;

    if (!options.extModule) {
      options.extModule = new Container();
    }
  }

  async run() {
    this.index--;
    const { container, provider, options } = this;

    if (this.index < 0) {
      return await provider.meta.targetProvider.resolver(
        container,
        provider.meta.targetProvider,
        options,
      );
    }

    const extModule = options.extModule;
    const proxyCnf = provider.meta.proxiesCnfs[this.index];
    const proxyContext = new ProxyContext({
      next: () => this.run(),
      extModule,
      meta: proxyCnf.meta,
      token: provider.token,
    });

    await extModule.addProviders([
      proxyCnf.proxy,
      { token: ProxyContext, useValue: proxyContext },
    ]);

    const proxy = await container.resolve<ProxyHandler>(
      proxyCnf.proxy,
      options,
    );

    // prevent token duplication.
    extModule.remove(proxyCnf.proxy);
    extModule.remove(ProxyContext);

    return await proxy.handle();
  }
}
