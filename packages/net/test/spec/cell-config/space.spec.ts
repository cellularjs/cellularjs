import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../src";
import { imsNetwork } from "../../fixture/share/network";

describe("CellConfig - cell space:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("space is comparable", async () => {
    await ControlPlane.createNetwork(imsNetwork);

    const authCell = ControlPlane.getResolvedCell('Auth');
    const userCell = ControlPlane.getResolvedCell('User');
    const imsCell = ControlPlane.getResolvedCell('IMS');

    expect(authCell.cellConfig.space === userCell.cellConfig.space).to.true;
    expect(authCell.spaceId === userCell.spaceId).to.true;
    expect(imsCell.cellConfig.space === userCell.cellConfig.space).to.false;
    expect(imsCell.spaceId === userCell.spaceId).to.false;
  });

});