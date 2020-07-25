import { Event, EventHandler, CellularIRS } from "../../../../../src";

@Event()
export class SignIn implements EventHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}