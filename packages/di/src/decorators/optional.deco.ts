import { CLL_OPTIONAL_DATA } from '../consts/meta-key.const';

/**
 * Mark a class's dependency as optional.
 *
 * **Note**: If there is no provider for dependency, it will return undefined.
 */
export const Optional = () => (target, _, index) => {
  // it may add something like default value in the future.
  const optionalData = {};

  Reflect.defineMetadata(CLL_OPTIONAL_DATA, optionalData, target, `${index}`);

  return target;
};
