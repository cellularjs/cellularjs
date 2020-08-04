import { Module } from "../../../src";
import { JwtModule } from "./jwt/jwt.module";
import { MongoModule } from "./mongo/mongo.module";

@Module({
  exports: [
    JwtModule,
    MongoModule.config({
      mongoUrl: "**********",
      user: "********",
      password: "*******",
    }),
  ],
})
export class SharedModule { }