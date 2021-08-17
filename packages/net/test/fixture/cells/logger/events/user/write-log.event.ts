import { Inject } from "@cellularjs/di";
import { Service, ServiceHandler, CellularIRS, CellularIRQ, CLL_IRQ } from "../../../../../../src";

@Service({
  scope: "space",
})
export class WriteLog implements ServiceHandler {
  constructor(
    @Inject(CLL_IRQ) private irq: CellularIRQ,
  ) { }

  handle() {
    return new CellularIRS({ ...this.irq.body, writeLog: true });
  }
}