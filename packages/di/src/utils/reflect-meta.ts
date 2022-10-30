import { ModuleMeta } from '..';
import { ForwardRefCallback, ClassType } from '../internal';
import {
  CLL_MODULE,
  CLL_INJECTABLE,
  CLL_PARAM_TYPES,
  CLL_FORWARD_REF,
  CLL_OPTIONAL_DATA,
} from '../consts/meta-key.const';

/**
 * @param moduleClass Module class is a class decorated by `@Module` annotation
 *
 * @since 0.1.0
 */
export function getModuleMeta(moduleClass: ClassType): ModuleMeta {
  return Reflect.getMetadata(CLL_MODULE, moduleClass);
}

/**
 * @since 0.1.0
 */
export function getInjectable(service): ModuleMeta {
  return Reflect.getMetadata(CLL_INJECTABLE, service);
}

/**
 * @since 0.1.0
 */
export function getForwardRefCallback(
  target: ClassType,
  index,
): ForwardRefCallback | undefined {
  return Reflect.getMetadata(CLL_FORWARD_REF, target, `${index}`);
}

/**
 * @since 0.1.0
 */
export function getParamTypes(target: ClassType): any[] {
  return Reflect.getMetadata(CLL_PARAM_TYPES, target) || [];
}

/**
 * @since 0.1.0
 */
export function getOptionalData(target: ClassType, index): any {
  return Reflect.getMetadata(CLL_OPTIONAL_DATA, target, `${index}`);
}
