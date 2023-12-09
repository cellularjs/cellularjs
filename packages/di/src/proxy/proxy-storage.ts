import { ClassType } from '../internal';
import { Token } from '../';
import { ProxyMeta } from './type';

interface ProxyConfig {
  proxy: ClassType;
  meta?: ProxyMeta;
}

const _proxyStorage = new Map<Token, ProxyConfig[]>();

/**
 * Add a proxy that help modify resolved value.
 *
 * @see https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#3-proxy
 * @since 0.11.0
 */
export function addProxy(token: ClassType, proxyCnf: ProxyConfig) {
  const proxyCnfs = getProxies(token);

  proxyCnfs.push(proxyCnf);

  _proxyStorage.set(token, proxyCnfs);
}

/**
 * @since 0.11.0
 */
export function getProxies(token: ClassType) {
  return _proxyStorage.get(token) || [];
}
