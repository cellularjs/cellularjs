import { Module } from "../../../../src";
import { UserService } from "./user.service";

@Module({
  exports: [UserService],
})
export class AuthModule { }