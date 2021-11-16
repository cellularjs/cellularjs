import { Token } from '../';
import { ForwardRef } from './forward-ref.class';

type ForwardRefCallback = () => Token;

/**
 * Circular dependency injection helper.
 */
export function forwardRef(callback: ForwardRefCallback) {
  return new ForwardRef(callback);
}