import { Service, ServiceHandler, CellularIRS } from "../../../../../src";

@Service()
export class DummyService implements ServiceHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}