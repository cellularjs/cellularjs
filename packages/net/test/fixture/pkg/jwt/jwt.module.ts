import { Module } from "@cellularjs/di";
import { JwtService } from "../jwt/jwt.service";

@Module({
  exports: [JwtService],
})
export class JwtModule { }