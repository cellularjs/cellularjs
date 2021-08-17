import { Service, ServiceHandler, CellularIRS } from "../../../../../src";

@Service({ scope: "space" })
export class SendMail implements ServiceHandler {
  handle() {
    return new CellularIRS();
  }
}