import { ForwardRef, ForwardRefCallback } from './';

/**
 * Circular dependency injection helper.
 *
 * For more examples, let have a look at
 * https://github.com/cellularjs/cellularjs/blob/master/packages/di/test/spec/forward-ref/forward-ref.spec.ts
 *
 * @see https://cellularjs.com/docs/foundation/dependency-injection/basic-usage#23-forwardref
 * @since 0.1.0
 */
export function forwardRef(callback: ForwardRefCallback) {
  return new ForwardRef(callback);
}
