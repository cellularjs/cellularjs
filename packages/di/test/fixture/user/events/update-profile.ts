import { Injectable } from "../../../../src";
import { UserService } from "../../pkg/auth/user.service"

@Injectable()
export class UpdateProfile {
  constructor(
    private _: UserService,
  ) { }
}