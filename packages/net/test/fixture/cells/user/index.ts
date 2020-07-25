import { Cell } from "../../../../src";
import { CreateProfile } from "./events/create-profile.event";

@Cell({
  listen: { CreateProfile },
})
export class AuthCell { }