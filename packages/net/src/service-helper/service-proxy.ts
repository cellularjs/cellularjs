import { ServiceHandler } from '../'

type ClassType<T> = { new(...args: any[]): T };

let serviceProxies = new Map<any, ClassType<ServiceHandler>[]>();

export function addServiceProxies(service, newProxies: ClassType<ServiceHandler>[]) {
  const proxies = serviceProxies.get(service) || [];
  serviceProxies.set(service, proxies.concat(newProxies));
}

export function getServiceProxies(service) {
  return serviceProxies.get(service) || [];
}

export function cleanServiceProxies() {
  serviceProxies = new Map();
}
