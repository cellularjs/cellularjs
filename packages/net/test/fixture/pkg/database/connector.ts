import { Injectable } from '@cellularjs/di';
import { PoolHolder } from './pool-holder';

@Injectable()
export class Connector {
  constructor(private poolHolder: PoolHolder) {}

  getSession() {
    return this.poolHolder.getSession();
  }
}
