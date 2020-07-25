import { Event, EventHandler, CellularIRS } from "../../../../../src";

@Event()
export class LockAccount implements EventHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}