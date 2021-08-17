import { Inject } from "@cellularjs/di";
import { Service, ServiceHandler, CellularIRQ, CellContext, CLL_CELL_CTX, Transportor } from "../../../../../src";

@Service({ scope: "public" })
export class DelegateUnlockAccount implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx: CellContext,
  ) {}

  handle() {
    const delegateUnlockAccountIrq = new CellularIRQ(
      { unicast: "Auth:UnlockAccount" },
    );

    return Transportor.send(delegateUnlockAccountIrq, { refererCell: this.ctx, throwOnError: true });
  }
}
