/**
 * This is just a sample, you need to remove it.
 */

import { Service, ServiceHandler } from '@cellularjs/net';

@Service({ scope: 'publish' })
export class SayHelloCmd implements ServiceHandler {
  handle() {
    return 'hello halo';
  }
}
