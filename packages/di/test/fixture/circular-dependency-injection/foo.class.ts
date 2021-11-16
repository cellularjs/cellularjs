import { Inject, Injectable, forwardRef } from '../../../src';
import { Bar } from './'

@Injectable()
export class FooWithoutForwardRef {
  constructor(
    public bar: Bar,
  ) { }
}

export class FooWithForwardRef {
  constructor(
    @Inject(forwardRef(() => Bar))
    public bar: Bar,
  ) { }
}