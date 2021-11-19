import { ModuleMeta } from '..';
import { ForwardRefCallback, ClassType } from '../internal';
import { CLL_MODULE, CLL_INJECTABLE, CLL_PARAM_TYPES, CLL_FORWARD_REF } from '../consts/meta-key.const';

/**
 * @param moduleClass Module class is a class decorated by `@Module` annotation
 */
export function getModuleMeta(moduleClass: ClassType): ModuleMeta {
  return Reflect.getMetadata(CLL_MODULE, moduleClass);
}

export function getInjectable(service): ModuleMeta {
  return Reflect.getMetadata(CLL_INJECTABLE, service);
}

export function getForwardRefCallback(target: ClassType, index): ForwardRefCallback | undefined {
  return Reflect.getMetadata(CLL_FORWARD_REF, target, `${index}`)
}

export function getParamTypes(target: ClassType): any[] {
  return Reflect.getMetadata(CLL_PARAM_TYPES, target) || [];
}