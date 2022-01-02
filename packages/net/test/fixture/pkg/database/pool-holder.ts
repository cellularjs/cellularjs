import { Injectable } from '@cellularjs/di';
import { Session, DatabaseConfig } from './key';

@Injectable()
export class PoolHolder {
  private pool: Session[] = [];

  constructor(config: DatabaseConfig) {
    for (let i = 0; i < config.poolSize; i++) {
      this.pool.push(new Session());
    }
  }

  getSession() {
    return this.pool[0];
  }
}
