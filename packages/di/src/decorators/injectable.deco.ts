import { CLL_INJECTABLE } from '../consts/meta-key.const';

/**
 * Injectable is used to mark a class as injectable
 * (~container can inject dependencies into this class).
 *
 * Technically, you need to use atleast one decorator to decorate a class that
 * you want to inject dependencies. `Injectable` decorator is a good
 * choice if you don't know what decorator should be used.
 *
 * @see https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#21-injectable
 * @since 0.1.0
 */
export const Injectable = () => (target) => {
  Reflect.defineMetadata(CLL_INJECTABLE, true, target);
  return target;
};
