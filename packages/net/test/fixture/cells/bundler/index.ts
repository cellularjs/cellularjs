import { Cell } from '../../../../src';
import * as barRequest from './request/bar.request';
import * as fooService from './services/foo.service';

@Cell({
  providers: [
    // Simulate result bundle by bundler(eg: webpack)
    // It is same as below code:
    // providers: [
    //   './request',
    // ]
    [barRequest] as any,
  ],

  // Simulate result bundle by bundler(eg: webpack)
  // It is same as below code:
  // listen: './services',
  listen: [fooService] as any,
})
export class BundlerCell {}

@Cell({
  listen: [fooService, fooService] as any,
})
export class BundlerCellWithDuplicateService {}
