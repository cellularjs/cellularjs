import { GenericProvider } from '@cellularjs/di';

let serviceProviders = new Map<any, GenericProvider<any>[]>();

export function addServiceProviders(service, newProviders: GenericProvider<any>[]) {
  const providers = serviceProviders.get(service) || [];
  serviceProviders.set(service, providers.concat(newProviders));
}

export function getServiceProviders(service) {
  return serviceProviders.get(service) || [];
}

export function cleanServiceProviders() {
  serviceProviders = new Map();
}
