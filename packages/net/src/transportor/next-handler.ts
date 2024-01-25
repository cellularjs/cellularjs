import { Container } from '@cellularjs/di';
import { ServiceHandler, ServiceHandlerClass, normalizeIrs } from '../internal';
/**
 * Instead of resolve all handlers/proxies and it's dependencies at once.
 * `NextHandler` allow you to resolve and run next (proxy/service) handler lazily.
 *
 * @since 0.1.0
 */
export class NextHandler {
  private currentIndex: number;

  constructor(
    private ServiceHandlerClass: ServiceHandlerClass,
    private proxyClasses: ServiceHandlerClass[],
    private extModule: Container,
    private rootContainer: Container,
  ) {
    this.currentIndex = proxyClasses.length - 1;
  }

  private async getNextProxy(): Promise<ServiceHandler> {
    const { proxyClasses, rootContainer, extModule } = this;
    const proxyClass = proxyClasses[this.currentIndex];
    this.currentIndex--;

    await this.extModule.addProvider(proxyClass);

    return rootContainer.resolve(proxyClass, {
      extModule,
    });
  }

  /**
   * Resolve next proxy/service dependencies and run.
   *
   * @since 0.1.0
   */
  async handle() {
    if (this.currentIndex > -1) {
      const nextProxy = await this.getNextProxy();
      const result = await nextProxy.handle();

      return normalizeIrs(result);
    }

    const serviceHandler: ServiceHandler = await this.rootContainer.resolve(
      this.ServiceHandlerClass,
      { extModule: this.extModule },
    );

    const result = await serviceHandler.handle();

    return normalizeIrs(result);
  }

  /**
   * "Extend module" inside `NextHandler` object is a temporary container/module that
   * mean providers in this container will exists in a single **internal** request only.
   *
   * Use case: you can use `extModule` to add temporary data such as logged-in user data.
   *
   * @example https://cellularjs.com/docs/how-to%20wiki/auth
   * @since 0.1.0
   */
  getExtModule() {
    return this.extModule;
  }
}
