import { Module } from "../../../src";
import { AuthModule } from "../pkg/auth/auth.module";
import { MongoModule } from "../pkg/mongo/mongo.module";
import { CreateProfile } from "./events/create-profile";
import { UpdateProfile } from "./events/update-profile";
import { CreateProfileReq } from "./services/create-profile.req";
import { UserRepository } from "./services/user.repository";

@Module({
  providers: [
    CreateProfileReq,
    UserRepository,
  ],
  imports: [
    AuthModule,
    MongoModule.config({
      mongoUrl: "neverland",
      user: "user",
      password: "********",
    }),
  ],
  exports: [
    CreateProfile,
    UpdateProfile,
  ],
})
export class UserModule { }