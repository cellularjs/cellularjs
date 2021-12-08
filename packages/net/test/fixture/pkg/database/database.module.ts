import { Module, ExtModuleMeta } from '@cellularjs/di';
import { PoolHolder } from './pool-holder';
import { DatabaseConfig } from './key';
import { Connector } from './connector';

@Module({
  providers: [
    { token: PoolHolder, useClass: PoolHolder },
  ],
  exports: [Connector],
})
export class DatabaseModule {
  static config(config: DatabaseConfig): ExtModuleMeta {
    return {
      extModule: DatabaseModule,
      providers: [
        { token: DatabaseConfig, useValue: config },
      ],
    };
  }
}