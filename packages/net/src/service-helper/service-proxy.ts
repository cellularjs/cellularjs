import { ServiceHandlerClass } from '../internal';

let serviceProxies = new Map<any, ServiceHandlerClass[]>();

/**
 * @deprecated it will be remove in the near future, let use
 * [@cellularjs/di proxy](https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#3-proxy) instead.
 */
export function addServiceProxies(
  service: ServiceHandlerClass,
  newProxies: ServiceHandlerClass[],
) {
  const proxies = serviceProxies.get(service) || [];
  serviceProxies.set(service, proxies.concat(newProxies));
}

/**
 * @deprecated it will be remove in the near future, let use
 * [@cellularjs/di proxy](https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#3-proxy) instead.
 */
export function getServiceProxies(service: ServiceHandlerClass) {
  return serviceProxies.get(service) || [];
}

/**
 * @deprecated it will be remove in the near future, let use
 * [@cellularjs/di proxy](https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#3-proxy) instead.
 */
export function cleanServiceProxies() {
  serviceProxies = new Map();
}
