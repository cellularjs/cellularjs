import "mocha";
import { expect } from "chai";
import { ControlPlane } from "../../../src";
import { userCellCnf } from "../../fixture/share/network";

describe("CellConfig - cell custom data:", () => {
  beforeEach(() => {
    (ControlPlane as any)._ResolvedCells = new Map();
  });

  it("can add custom data to cell config", async () => {
    const customData = {
      foo: 'bar',
    };

    await ControlPlane.createNetwork([
      { ...userCellCnf, customData },
    ]);

    const resolvedCell = ControlPlane.getResolvedCell('User');

    expect(resolvedCell.cellConfig.customData).to.eqls(customData);
  });

});