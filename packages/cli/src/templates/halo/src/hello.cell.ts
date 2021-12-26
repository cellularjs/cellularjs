/**
 * This is just a sample, you need to remove it.
 */

import { Cell } from '@cellularjs/net';
import { SayHelloCmd } from './say-hello.cmd';

@Cell({
  listen: { SayHelloCmd },
})
export class HelloCell { }