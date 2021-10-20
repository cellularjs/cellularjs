import 'mocha';
import { expect } from 'chai';
import {
  DEFAULT_DRIVER, createNetWork, cleanNetwork, getResolvedCell, CellContext, CLL_CELL_CTX,
} from '../../../../src';
import { JwtService } from '../../../fixture/pkg/jwt/jwt.service';
import { authCellCnf, userCellCnf } from '../../../fixture/share/network';
import { CustomContext } from '../../../fixture/share/custom-context';

describe('Decorator - @Cell annotation - context property:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('if context property is empty, default CellContext will be used for resolving', async () => {
    await createNetWork([authCellCnf]);

    const resolvedCell = getResolvedCell('Auth');
    const localDriver = resolvedCell.drivers.get(DEFAULT_DRIVER);

    const cellContext: CellContext = await localDriver.container.resolve(CLL_CELL_CTX);

    expect(cellContext).to.instanceOf(CellContext);
    expect(cellContext.cellName).to.equal('Auth');
  });

  it('if custom cell context is passed, that value will be used as cell context', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(DEFAULT_DRIVER);

    const cellCtx: CustomContext = await localDriver.container.resolve(CLL_CELL_CTX);

    expect(cellCtx).to.instanceOf(CustomContext);
    expect(cellCtx.cellName).to.equal('User');
  });

  it('custom cell context can leverage @cellularjs/di for dependency injection', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(DEFAULT_DRIVER);

    const cellCtx: CustomContext = await localDriver.container.resolve(CLL_CELL_CTX);

    expect(cellCtx.jwtService).to.instanceOf(JwtService);
  });
});