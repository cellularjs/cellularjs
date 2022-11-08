import { GenericProvider } from '@cellularjs/di';
import { ServiceHandlerClass } from '../internal';

let serviceProviders = new Map<any, GenericProvider[]>();

/**
 * @deprecated it will be remove in the near future.
 */
export function addServiceProviders(
  service: ServiceHandlerClass,
  newProviders: GenericProvider[],
) {
  const providers = serviceProviders.get(service) || [];
  serviceProviders.set(service, providers.concat(newProviders));
}

/**
 * @deprecated it will be remove in the near future.
 */
export function getServiceProviders(service: ServiceHandlerClass) {
  return serviceProviders.get(service) || [];
}

/**
 * @deprecated it will be remove in the near future.
 */
export function cleanServiceProviders() {
  serviceProviders = new Map();
}
