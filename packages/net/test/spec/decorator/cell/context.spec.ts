import "mocha";
import { expect } from "chai";
import { ControlPlane, CellContext, CLL_CELL_CTX } from "../../../../src";
import { JwtService } from "../../../fixture/pkg/jwt/jwt.service";
import { authCellCnf, userCellCnf } from "../../../fixture/share/network";
import { CustomContext } from "../../../fixture/share/custom-context";

describe("Decorator - @Cell annotation - context property:", () => {
  beforeEach(() => {
    (ControlPlane as any)._ResolvedCells = new Map();
  });

  it("if context property is empty, default CellContext will be used for resolving", async () => {
    await ControlPlane.createNetwork([authCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('Auth');
    const localDriver = resolvedCell.drivers.get(ControlPlane.DEFAULT_DRIVER);

    const cellContext: CellContext = await localDriver.container.resolve(CLL_CELL_CTX);

    expect(cellContext).to.instanceOf(CellContext);
    expect(cellContext.cellName).to.equal('Auth');
  });

  it("if custom cell context is passed, that value will be used as cell context", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(ControlPlane.DEFAULT_DRIVER);

    const cellCtx: CustomContext = await localDriver.container.resolve(CLL_CELL_CTX);

    expect(cellCtx).to.instanceOf(CustomContext);
    expect(cellCtx.cellName).to.equal('User');
  });

  it("custom cell context can leverage @cellularjs/di for dependency injection", async () => {
    await ControlPlane.createNetwork([userCellCnf]);

    const resolvedCell = ControlPlane.getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(ControlPlane.DEFAULT_DRIVER);

    const cellCtx: CustomContext = await localDriver.container.resolve(CLL_CELL_CTX);

    expect(cellCtx.jwtService).to.instanceOf(JwtService);
  });
});