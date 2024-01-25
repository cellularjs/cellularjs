import { Container, GenericProvider } from '@cellularjs/di';
import { ServiceHandler, NextHandler } from '..';
import {
  ClassType,
  ServiceHandlerClass,
  ServiceHandlerNormalized,
  normalizeIrs,
} from '../internal';
import { getServiceProviders, getServiceProxies } from '.';

type ResolveOpts = {
  /**
   * Resolving service handler including its
   * [service proxies](https://cellularjs.com/docs/foundation/net/service#41-service-proxy).
   *
   * Default: undefined(~ false).
   *
   * Eg: If `includeServiceProxy` = false, the proxy registered by `Transactional` will be ignored.
   * ```ts
   * import { Transactional } from '@cellularjs/typeorm';
   *
   * ⁣@Transactional()
   * ⁣@Service()
   * export class Regsiter { }
   * ```
   */
  includeServiceProxy?: boolean;

  /**
   * Resolving service handler including its
   * [service providers](https://cellularjs.com/docs/foundation/net/service#42-service-providers).
   *
   * Default: undefined(~ false).
   */
  includeServiceProvider?: boolean;

  /**
   * Eg: `rootContainer` can be used as a shared container in a cell.
   */
  rootContainer?: Container;

  /**
   * Usually, `providers` will be used for config temporary providers(eg: `IRQ`) when resolving a service handler.
   */
  providers?: GenericProvider[];
};

export class ServiceFactory {
  static async resolve<T extends ServiceHandler>(
    ServiceHandler: ClassType<T>,
    opts?: ResolveOpts,
  ): Promise<ServiceHandlerNormalized & T> {
    const extModule = await this.createExtModule(ServiceHandler, opts);
    const rootContainer = opts?.rootContainer || new Container();

    if (!rootContainer.has(ServiceHandler)) {
      await rootContainer.addProvider(ServiceHandler);
    }

    const proxyClasses = getServiceProxies(ServiceHandler);
    if (proxyClasses.length && opts?.includeServiceProxy) {
      return this.getServiceHandlerWithProxy(
        ServiceHandler,
        rootContainer,
        extModule,
        proxyClasses,
      );
    }

    const serviceHandler = await rootContainer.resolve(ServiceHandler, {
      extModule,
    });

    const handleFunc = serviceHandler.handle.bind(serviceHandler);
    serviceHandler.handle = async () => normalizeIrs(await handleFunc());

    return serviceHandler;
  }

  private static async createExtModule(
    ServiceHandler: ServiceHandlerClass,
    opts?: ResolveOpts,
  ): Promise<Container> {
    const extModule = new Container();

    opts?.providers && (await extModule.addProviders(opts.providers));

    opts?.includeServiceProvider &&
      (await extModule.addProviders(getServiceProviders(ServiceHandler)));

    return extModule;
  }

  private static async getServiceHandlerWithProxy<
    T extends ServiceHandlerNormalized,
  >(
    ServiceHandler: ClassType<T>,
    rootContainer: Container,
    extModule: Container,
    proxyClasses: ServiceHandlerClass[],
  ): Promise<T> {
    const nextHandler = new NextHandler(
      ServiceHandler,
      proxyClasses,
      extModule,
      rootContainer,
    );

    await extModule.addProvider({
      token: NextHandler,
      useValue: nextHandler,
    });

    return {
      handle: () => nextHandler.handle(),
    } as T;
  }
}
