import { Inject } from "@cellularjs/di";
import { Service, ServiceHandler, Transportor, CellularIRS, CellularIRQ, CLL_CELL_CTX } from "../../../../../src";

@Service({ scope: "public" })
export class DelegateCacheHtml implements ServiceHandler {
  constructor(
    @Inject(CLL_CELL_CTX) private ctx,
  ) { }

  handle() {
    const cacheHtmlIrq = new CellularIRQ({ unicast: "IMS:CacheHtml" });

    return Transportor.send(cacheHtmlIrq, { refererCell: this.ctx, throwOnError: true });
  }
}