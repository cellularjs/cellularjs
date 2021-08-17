import "mocha";
import { expect } from "chai";
import { ControlPlane, ErrorCode } from "../../../src";
import { userCellCnf } from "../../fixture/share/network";

describe("ControlPlane - createNetwork:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("can create network with cell configs", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const userCell = ControlPlane.getResolvedCell('User');

    expect(userCell).to.not.undefined;
  });

  it("can not use duplicate cell name", async () => {
    try {
      await ControlPlane.createNetwork([userCellCnf, userCellCnf]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.DuplicateCellName)
    }
  });
});