import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../src";
import { userCellCnf } from "../../fixture/share/network";

describe("ControlPlane - getResolvedCell:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("can use cell name to get resolved cell", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('User');

    expect(resolvedCell.cellConfig).to.eqls(userCellCnf);
    expect(resolvedCell.drivers.has(ControlPlane.DEFAULT_DRIVER)).to.true;
  });

  it("will return undefined if resolved cell is not exist", async () => {
    const resolvedCell = ControlPlane.getResolvedCell('NotExist');

    expect(resolvedCell).to.undefined;
  });
});