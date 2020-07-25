import { Event, EventHandler, CellularIRS } from "../../../../../src";

@Event()
export class RenderHtml implements EventHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}