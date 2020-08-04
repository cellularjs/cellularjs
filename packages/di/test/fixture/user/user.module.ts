import { Module } from "../../../src";
import { MongoModule } from "../pkg/mongo/mongo.module";
import { CreateProfile } from "./events/create-profile";
import { CreateProfileReq } from "./services/create-profile.req";
import { UserRepository } from "./services/user.repository";

@Module({
  providers: [
    CreateProfileReq,
    UserRepository,
  ],
  imports: [
    MongoModule.config({
      mongoUrl: "neverland",
      user: "user",
      password: "********",
    }),
  ],
  exports: [
    CreateProfile,
  ],
})
export class UserModule { }