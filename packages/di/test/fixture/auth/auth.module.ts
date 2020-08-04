import { Module } from "../../../src";
import { JwtModule } from "../pkg/jwt/jwt.module"
import { MongoModule } from "../pkg/mongo/mongo.module";
import { Verify } from "./events/verify";
import { AuthRepository } from "./services/auth.repository";

@Module({
  providers: [
    AuthRepository,
  ],
  imports: [
    JwtModule,
    MongoModule.config({
      mongoUrl: "neverland",
      user: "auth",
      password: "********",
    }),
  ],
  exports: [Verify],
})
export class AuthModule { }