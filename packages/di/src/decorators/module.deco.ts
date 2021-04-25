import { CLL_MODULE } from "../consts/meta-key.const";
import { ModuleMeta } from "../";

/**
 * Config module with meta data.
 */
export const Module = (moduleMeta: ModuleMeta) => target => {
  Reflect.defineMetadata(CLL_MODULE, moduleMeta, target);
  return target;
}
