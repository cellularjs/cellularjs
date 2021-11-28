import { Cell } from '../../../../src';
import * as barRequestModule from './request/bar.request';
import * as fooServiceModule from './services/foo.service'

@Cell({
  providers: [
    // Simulate result bundle by bundler(eg: webpack)
    // It is same as below code:
    // providers: [
    //   './request',
    // ]
    [barRequestModule] as any,
  ],

  // Simulate result bundle by bundler(eg: webpack)
  // It is same as below code:
  // listen: './services',
  listen: [fooServiceModule] as any
})
export class WebpackCell {}