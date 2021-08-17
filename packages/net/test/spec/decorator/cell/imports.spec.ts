import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../../src";
import { userCellCnf } from "../../../fixture/share/network";
import { JwtService } from "../../../fixture/pkg/jwt/jwt.service";

describe("Decorator - @Cell annotation - imports property:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("can make use of @cellularjs/di to add module", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(ControlPlane.DEFAULT_DRIVER);

    const jwtService = await localDriver.container.resolve<JwtService>(JwtService);

    expect(jwtService).to.instanceOf(JwtService);
  });
});