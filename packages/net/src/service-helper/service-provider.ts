import { GenericProvider } from '@cellularjs/di';
import { ServiceHandlerClass } from '../internal';

let serviceProviders = new Map<any, GenericProvider[]>();

export function addServiceProviders(
  service: ServiceHandlerClass,
  newProviders: GenericProvider[],
) {
  const providers = serviceProviders.get(service) || [];
  serviceProviders.set(service, providers.concat(newProviders));
}

export function getServiceProviders(service: ServiceHandlerClass) {
  return serviceProviders.get(service) || [];
}

export function cleanServiceProviders() {
  serviceProviders = new Map();
}
