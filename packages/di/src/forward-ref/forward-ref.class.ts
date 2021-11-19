import { ForwardRefCallback } from './';

/**
 * This class is used to check if a token is create with `forwardRef` function.
 * 
 * @private Used inside "@cellularjs/di" only
 */
export class ForwardRef {
  constructor(public callback: ForwardRefCallback) { }
}
