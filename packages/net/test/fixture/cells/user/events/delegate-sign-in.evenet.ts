import { Inject } from "@cellularjs/di";
import { Service, ServiceHandler, Transportor, CellularIRS, CellularIRQ, CLL_CELL_CTX } from "../../../../../src";

@Service({ scope: "public" })
export class DelegateSignIn implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx,
  ) { }

  handle() {
    const signInIrq = new CellularIRQ({ unicast: "Auth:SignIn" });

    return Transportor.send(signInIrq, { refererCell: this.ctx });
  }
}