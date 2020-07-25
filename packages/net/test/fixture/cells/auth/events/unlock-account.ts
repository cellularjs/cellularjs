import { Event, EventHandler, CellularIRS } from "../../../../../src";

@Event()
export class UnlockAccount implements EventHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}