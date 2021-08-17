import { Inject } from "@cellularjs/di";
import { Service, ServiceHandler, Transportor, CellularIRS, CellularIRQ, CLL_CELL_CTX } from "../../../../../src";

@Service({
  scope: "public",
})
export class RenderHtml implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx,
  ) { }

  handle(): Promise<CellularIRS> {
    const cacheHtmlIrq = new CellularIRQ(
      { unicast: "IMS:CacheHtml" },
    );

    return Transportor.send(cacheHtmlIrq, { refererCell: this.ctx });
  }
}