import { Cell } from '../../../../src';
import { createRequireContextMock } from '../../../helper/require-context';
import * as barRequest from './request/bar.request';
import * as fooService from './services/foo.service';

const providerMock = createRequireContextMock({
  any_key_1: barRequest,
});

const serviceMock = createRequireContextMock({
  any_key_1: fooService,
});

const mockWithDuplicateService = createRequireContextMock({
  any_key_1: fooService,
  any_key_2: fooService,
});

@Cell({
  providers: [
    // Simulate result bundle by bundler(eg: webpack)
    // It is same as below code:
    // providers: [
    //   './request',
    // ]
    [providerMock] as any,
  ],

  // Simulate result bundle by bundler(eg: webpack)
  // It is same as below code:
  // listen: './services',
  listen: [serviceMock] as any,
})
export class BundlerCell {}

@Cell({
  listen: [mockWithDuplicateService] as any,
})
export class BundlerCellWithDuplicateService {}
