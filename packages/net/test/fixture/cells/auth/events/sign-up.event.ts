import { Event, EventHandler, CellularIRS } from "../../../../../src";

@Event()
export class SignUp implements EventHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}