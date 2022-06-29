import { Module } from '@cellularjs/di';
import { EnvModule } from '@cellularjs/env';
import { Env } from './env';

@Module({
  exports: [EnvModule.config({ token: Env })],
})
export class CommonModule {}
