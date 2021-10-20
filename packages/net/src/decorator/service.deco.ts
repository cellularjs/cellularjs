import { ServiceMeta, ServiceScopeMap, RoutingTypeMap, AjustedServiceMeta } from '..';
import { CLL_EVENT_OPTS } from '..';

/**
 * Mark a class as event handler.
 */
export const Service = (eventMeta?: ServiceMeta) => (target) => {
  const meta = eventMeta || {};

  const adjustedMeta: AjustedServiceMeta = {
    ...meta,
    scope: ServiceScopeMap[meta.scope] || ServiceScopeMap.space,
    route: RoutingTypeMap[meta.route] || RoutingTypeMap.unicast,
    pipes: meta.pipes || [],
  };

  Reflect.defineMetadata(CLL_EVENT_OPTS, adjustedMeta, target);

  return target;
}