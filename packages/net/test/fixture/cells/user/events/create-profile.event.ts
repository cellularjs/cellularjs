import { Event, EventHandler, CellularIRS } from "../../../../../src";

@Event()
export class CreateProfile implements EventHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}