import {
  ServiceMeta,
  ServiceScopeMap,
  AjustedServiceMeta,
  CLL_SERVICE_OPTS,
} from '../internal';

/**
 * Mark a class as service handler.
 *
 * @see https://cellularjs.com/docs/foundation/net/service
 * @since 0.1.0
 */
export const Service = (serviceMeta?: ServiceMeta) => (target) => {
  const meta = serviceMeta || {};

  const adjustedMeta: AjustedServiceMeta = {
    ...meta,
    scope: ServiceScopeMap[meta.scope] || ServiceScopeMap.space,
  };

  Reflect.defineMetadata(CLL_SERVICE_OPTS, adjustedMeta, target);

  return target;
};
