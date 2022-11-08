import { Container } from '@cellularjs/di';
import {
  ServiceHandler,
  ServiceHandlerClass,
  ResolvedDriver,
  IRS,
} from '../internal';

/**
 * Instead of resolve all handlers/proxies and it's dependencies at once.
 * `NextHandler` allow you to resolve and run next (proxy/service) handler lazily.
 *
 * @deprecated it will be remove in the near future, let use
 * [@cellularjs/di proxy](https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#3-proxy) instead.
 */
export class NextHandler {
  private currentIndex: number;

  constructor(
    private ServiceHandlerClass: ServiceHandlerClass,
    private proxyClasses: ServiceHandlerClass[],
    private extModule: Container,
    private resolvedDriver: ResolvedDriver,
  ) {
    this.currentIndex = proxyClasses.length - 1;
  }

  private async getNextProxy(): Promise<ServiceHandler> {
    const proxyClass = this.proxyClasses[this.currentIndex];
    this.currentIndex--;

    await this.extModule.addProvider(proxyClass);

    const { container } = this.resolvedDriver;

    return container.resolve(proxyClass, {
      extModule: this.extModule,
    });
  }

  /**
   * Resolve next proxy/service dependencies and run.
   */
  async handle() {
    if (this.currentIndex > -1) {
      const nextProxy = await this.getNextProxy();
      const result = await nextProxy.handle();

      return result instanceof IRS ? result : new IRS({ status: 200 }, result);
    }

    const { container } = this.resolvedDriver;
    const serviceHandler: ServiceHandler = await container.resolve(
      this.ServiceHandlerClass,
      { extModule: this.extModule },
    );

    const result = await serviceHandler.handle();

    return result instanceof IRS ? result : new IRS({ status: 200 }, result);
  }

  /**
   * "Extend module" inside `NextHandler` object is a temporary container/module that
   * mean providers in this container will exists in a single **internal** request only.
   *
   * Use case: you can use `extModule` to add temporary data such as logged-in user data.
   * @example https://cellularjs.com/docs/how-to%20wiki/auth
   */
  getExtModule() {
    return this.extModule;
  }
}
