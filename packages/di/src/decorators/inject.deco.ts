import { CLL_TOKEN } from "../consts/meta-key.const";
import { Token } from "../";

/**
 * Allow to inject dependency with specific token.  
 * *For now, it only support inject dependency via constructor.*
 */
export const Inject = (token: Token) => (target, _, index) => {
  Reflect.defineMetadata(CLL_TOKEN, token, target, `${index}`);
  return target;
}