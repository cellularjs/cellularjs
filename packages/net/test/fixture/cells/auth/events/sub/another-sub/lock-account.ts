import { Service, ServiceHandler, CellularIRS } from "../../../../../../../src";

@Service()
export class LockAccount implements ServiceHandler {
  async handle(): Promise<CellularIRS> {
    return new CellularIRS();
  }
}