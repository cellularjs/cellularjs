import { Cell } from "../../../../src";
import { CustomContext } from "../../share/custom-context";
import { SignIn } from "./events/sign-in.event";
import { SignUp } from "./events/sign-up.event";

@Cell({
  context: CustomContext,
  listen: { SignIn, SignUp },
})
export class AuthCell { }