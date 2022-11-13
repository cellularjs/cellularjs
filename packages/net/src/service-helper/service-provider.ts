import { GenericProvider } from '@cellularjs/di';
import { ServiceHandlerClass } from '../internal';

let serviceProviders = new Map<any, GenericProvider[]>();

/**
 * @since 0.1.0
 */
export function addServiceProviders(
  service: ServiceHandlerClass,
  newProviders: GenericProvider[],
) {
  const providers = serviceProviders.get(service) || [];
  serviceProviders.set(service, providers.concat(newProviders));
}

/**
 * @since 0.1.0
 */
export function getServiceProviders(service: ServiceHandlerClass) {
  return serviceProviders.get(service) || [];
}

/**
 * @since 0.1.0
 */
export function cleanServiceProviders() {
  serviceProviders = new Map();
}
