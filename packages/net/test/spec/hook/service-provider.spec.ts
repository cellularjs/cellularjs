import { afterEach } from "mocha";
import { ControlPlane, Hook, Cell, Transportor, CellularIRQ } from "../../../src";
import { EditFooService, Session } from '../../fixture/hook';


describe("Hook - addServiceProviders()", () => {
  beforeEach(async () => {
    @Cell({
      listen: { EditFooService }
    })
    class LocalDriver { }

    await ControlPlane.createNetwork([
      { name: 'Provider', driver: LocalDriver },
    ]);
  });

  afterEach(async () => {
    await ControlPlane.clean();
  })

  it("can add provider for resolving service handler", async () => {
    Hook.addServiceProviders(EditFooService, [Session]);

    const irq = new CellularIRQ({ unicast: 'Provider:EditFooService' });
    await Transportor.send(irq, { throwOnError: true});
  });
});