import { CLL_TOKEN } from '../consts/meta-key.const';
import { Token } from '../';
import { ForwardRef } from '../internal';

/**
 * Allow to inject dependency with specific token.  
 * *For now, it only support inject dependency via constructor.*
 */
export const Inject = (token: Token) => (target, _, index) => {
  const newToken = token instanceof ForwardRef ? token.callback : () => token;

  Reflect.defineMetadata(CLL_TOKEN, newToken, target, `${index}`);
  return target;
}