import { ServiceMeta, ServiceScopeMap, AjustedServiceMeta } from '..';
import { CLL_EVENT_OPTS } from '..';

/**
 * Mark a class as event handler.
 */
export const Service = (eventMeta?: ServiceMeta) => (target) => {
  const meta = eventMeta || {};

  const adjustedMeta: AjustedServiceMeta = {
    ...meta,
    scope: ServiceScopeMap[meta.scope] || ServiceScopeMap.space,
  };

  Reflect.defineMetadata(CLL_EVENT_OPTS, adjustedMeta, target);

  return target;
}