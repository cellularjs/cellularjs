import { ModuleMeta } from "..";
import { CLL_MODULE, CLL_INJECTABLE, CLL_PARAM_TYPES, CLL_TOKEN } from "../consts/meta-key.const";

/**
 * @param moduleClass Module class is a class decorated by `@Module` annotation
 */
export function getModuleMeta(moduleClass): ModuleMeta {
  return Reflect.getMetadata(CLL_MODULE, moduleClass);
}

export function getInjectable(service): ModuleMeta {
  return Reflect.getMetadata(CLL_INJECTABLE, service);
}

export function getToken(target, index) {
  return Reflect.getMetadata(CLL_TOKEN, target, `${index}`)
}

export function getParamTypes(target): any[] {
  return Reflect.getMetadata(CLL_PARAM_TYPES, target) || [];
}