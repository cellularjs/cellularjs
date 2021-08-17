import { GenericProvider } from '@cellularjs/di';
import { ServiceHandler } from '../'

type ClassType<T> = { new(...args: any[]): T };

export class Hook {
  private static serviceProxies = new Map<any, ClassType<ServiceHandler>[]>();
  private static serviceProviders = new Map<any, GenericProvider<any>[]>();

  static addServiceProviders(service, newProviders: GenericProvider<any>[]) {
    const providers = Hook.serviceProviders.get(service) || [];
    Hook.serviceProviders.set(service, providers.concat(newProviders));
  }

  /**
   * Add global provider to this service.
   */
  static getServiceProviders(service) {
    return Hook.serviceProviders.get(service) || [];
  }

  static addServiceProxies(service, newProxies: ClassType<ServiceHandler>[]) {
    const proxies = Hook.serviceProxies.get(service) || [];
    Hook.serviceProxies.set(service, proxies.concat(newProxies));
  }

  static getServiceProxies(service) {
    return Hook.serviceProxies.get(service) || [];
  }

  static clean() {
    Hook.serviceProxies = new Map();
    Hook.serviceProviders = new Map();
  }
}
