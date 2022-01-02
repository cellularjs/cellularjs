import { ForwardRef, ForwardRefCallback } from './';

/**
 * Circular dependency injection helper.
 */
export function forwardRef(callback: ForwardRefCallback) {
  return new ForwardRef(callback);
}
