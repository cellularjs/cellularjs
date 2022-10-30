import { CLL_MODULE } from '../consts/meta-key.const';
import { ModuleMeta } from '../';

/**
 * Config module with meta data.
 *
 * @see https://cellularjs.com/docs/foundation/dependency-injection/module
 * @since 0.1.0
 */
export const Module = (moduleMeta: ModuleMeta) => (target) => {
  Reflect.defineMetadata(CLL_MODULE, moduleMeta, target);
  return target;
};
