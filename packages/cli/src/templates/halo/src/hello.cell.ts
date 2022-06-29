/**
 * This is just a sample, you need to remove it.
 */

import { Cell } from '@cellularjs/net';
import { CommonModule } from './common.module';
import { SayHelloCmd } from './say-hello.cmd';

@Cell({
  imports: [CommonModule],
  listen: { SayHelloCmd },
})
export class HelloCell {}
