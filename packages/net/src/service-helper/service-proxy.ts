import { ServiceHandlerClass } from '../internal';

let serviceProxies = new Map<any, ServiceHandlerClass[]>();

/**
 * @since 0.1.0
 */
export function addServiceProxies(
  service: ServiceHandlerClass,
  newProxies: ServiceHandlerClass[],
) {
  const proxies = serviceProxies.get(service) || [];
  serviceProxies.set(service, proxies.concat(newProxies));
}

/**
 * @since 0.1.0
 */
export function getServiceProxies(service: ServiceHandlerClass) {
  return serviceProxies.get(service) || [];
}

/**
 * @since 0.1.0
 */
export function cleanServiceProxies() {
  serviceProxies = new Map();
}
