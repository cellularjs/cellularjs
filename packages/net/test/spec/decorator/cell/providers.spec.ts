import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../../src";
import { userCellCnf } from "../../../fixture/share/network";
import { UserRepo } from "../../../fixture/cells/user/services/user.repo";

describe("Decorator - @Cell annotation - providers property:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("can make use of @cellularjs/di to add providers", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(ControlPlane.DEFAULT_DRIVER);

    const userRepo = await localDriver.container.resolve<UserRepo>(UserRepo);

    expect(userRepo).to.instanceOf(UserRepo);
  });
});