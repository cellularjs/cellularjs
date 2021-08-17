import "mocha";
import { expect } from "chai";
import { CellConfig, ControlPlane, ErrorCode } from "../../../src";
import { authCellCnf, userCellCnf } from "../../fixture/share/network";

describe("CellConfig - cell driver:", () => {
  beforeEach(async () => {
    await ControlPlane.clean();
  });

  it("can not resolve driver which is not decorated by @Cell annotation", async () => {
    try {
      class DummyClass {}
      const invalidCellClassCnf: CellConfig = {
        driver: DummyClass,
        name: 'DummyClass',
        space: 'DummyClass',
      };

      await ControlPlane.createNetwork([invalidCellClassCnf]);

      expect(true).to.false;
    } catch(err) {
      expect(err.code).to.equal(ErrorCode.InvalidDriverClass);
    }
  });

  it("driver config is a string will be treated as local driver", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('User');

    expect(resolvedCell.cellConfig).to.eqls(userCellCnf);
    expect(resolvedCell.drivers.has(ControlPlane.DEFAULT_DRIVER)).to.true;
  });

  it("can add a cell which has multiple types of driver into network", async () => {
    await ControlPlane.createNetwork([authCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('Auth');

    expect(resolvedCell.cellConfig).to.eqls(authCellCnf);
    expect(resolvedCell.drivers.has(ControlPlane.DEFAULT_DRIVER)).to.true;
    expect(resolvedCell.drivers.has('http')).to.true;
  });
});