import { Service } from '../../../../../src';
import { BarRequest } from '../request/bar.request';

@Service({
  scope: 'publish',
})
export class FooService {
  constructor(public barRequest: BarRequest) {}

  handle() {
    return this.barRequest.irq.header.to;
  }
}
