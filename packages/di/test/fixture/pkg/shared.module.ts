import { Module } from "../../../src";
import { AuthModule } from "./auth/auth.module"
import { JwtModule } from "./jwt/jwt.module";
import { MongoModule } from "./mongo/mongo.module";

@Module({
  exports: [
    AuthModule,
    JwtModule,
    MongoModule.config({
      mongoUrl: "**********",
      user: "********",
      password: "*******",
    }),
  ],
})
export class SharedModule { }