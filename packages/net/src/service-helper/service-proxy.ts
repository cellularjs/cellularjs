import { ServiceHandlerClass } from '../internal';

let serviceProxies = new Map<any, ServiceHandlerClass[]>();

export function addServiceProxies(service: ServiceHandlerClass, newProxies: ServiceHandlerClass[]) {
  const proxies = serviceProxies.get(service) || [];
  serviceProxies.set(service, proxies.concat(newProxies));
}

export function getServiceProxies(service: ServiceHandlerClass) {
  return serviceProxies.get(service) || [];
}

export function cleanServiceProxies() {
  serviceProxies = new Map();
}
