import { Token, ForwardRef, ForwardRefCallback } from '../internal';
import { CLL_FORWARD_REF } from '../consts/meta-key.const';

/**
 * Allow to inject dependency with specific token.
 * *For now, it only support inject dependency via constructor.*
 */
export const Inject = (token: Token) => (target, _, index) => {
  const forwardRefCb: ForwardRefCallback =
    token instanceof ForwardRef ? token.callback : () => token;

  Reflect.defineMetadata(CLL_FORWARD_REF, forwardRefCb, target, `${index}`);

  return target;
};
