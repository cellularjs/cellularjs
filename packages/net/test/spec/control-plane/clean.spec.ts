import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../src";
import { userCellCnf } from "../../fixture/share/network";

describe("ControlPlane - clean:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("can run clean many times without any problem", async () => {
    await ControlPlane.clean();
    await ControlPlane.clean();
  })

  it("can remove resolved cells", async () => {
    await ControlPlane.createNetwork([userCellCnf]);
    await ControlPlane.clean();
  
    const userCell = ControlPlane.getResolvedCell('User');
    expect(userCell).to.undefined;
  })
});