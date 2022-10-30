import { ForwardRef, ForwardRefCallback } from './';

/**
 * Circular dependency injection helper.
 *
 * @see https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#23-forwardref
 * @since 0.1.0
 */
export function forwardRef(callback: ForwardRefCallback) {
  return new ForwardRef(callback);
}
