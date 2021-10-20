import { Module } from '@cellularjs/di';
import { JwtService } from './jwt.service';

@Module({
  exports: [JwtService],
})
export class JwtModule { }