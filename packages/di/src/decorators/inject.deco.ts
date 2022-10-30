import { Token, ForwardRef, ForwardRefCallback } from '../internal';
import { CLL_FORWARD_REF } from '../consts/meta-key.const';

/**
 * If you want to use a string, number, ... as token instead of a class,
 * you will need to use `Inject` decorator for dependency injection.
 *
 * _(For now, `Inject` decorator only support inject dependency via constructor)._
 *
 * @see https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#22-inject
 * @since 0.1.0
 */
export const Inject = (token: Token) => (target, _, index) => {
  const forwardRefCb: ForwardRefCallback =
    token instanceof ForwardRef ? token.callback : () => token;

  Reflect.defineMetadata(CLL_FORWARD_REF, forwardRefCb, target, `${index}`);

  return target;
};
