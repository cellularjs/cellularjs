import { CLL_MODULE, CLL_INJECTABLE, CLL_TOKEN } from "./meta-key";
import { ModuleMeta, Token } from "./index";

/**
 * Make class's dependencies become injectable.  
 * *Technically, typescript require using a decorator to emit type.*
 */
export const Injectable = () => target => {
  Reflect.defineMetadata(CLL_INJECTABLE, true, target);
  return target;
}

/**
 * Allow to inject dependency with specific token.  
 * *For now, it only support inject dependency via constructor.*
 */
export const Inject = (token: Token) => (target, _, index) => {
  Reflect.defineMetadata(CLL_TOKEN, token, target, `${index}`);
  return target;
}

/**
 * Config module with meta data.
 */
export const Module = (moduleMeta: ModuleMeta) => target => {
  Reflect.defineMetadata(CLL_MODULE, moduleMeta, target);
  return target;
}
