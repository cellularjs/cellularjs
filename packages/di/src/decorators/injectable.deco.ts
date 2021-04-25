import { CLL_INJECTABLE } from "../consts/meta-key.const";

/**
 * Make class's dependencies become injectable.  
 * *Technically, typescript require using a decorator to emit type.*
 */
export const Injectable = () => target => {
  Reflect.defineMetadata(CLL_INJECTABLE, true, target);
  return target;
}