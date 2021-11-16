import 'mocha';
import { expect } from 'chai';
import {
  LOCAL_DRIVER, createNetWork, getResolvedCell, CellContext,
} from '../../../../src';
import { cleanNetwork } from '../../../../src/internal';
// import { JwtService } from '../../../fixture/pkg/jwt/jwt.service';
import { authCellCnf, userCellCnf } from '../../../fixture/share/network';

describe('Decorator - @Cell annotation - context property:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('if context property is empty, default CellContext will be used for resolving', async () => {
    await createNetWork([authCellCnf]);

    const resolvedCell = getResolvedCell('Auth');
    const localDriver = resolvedCell.drivers.get(LOCAL_DRIVER);

    const cellContext: CellContext = await localDriver.container.resolve(CellContext);

    expect(cellContext).to.instanceOf(CellContext);
    expect(cellContext.cellName).to.equal('Auth');
  });

  it('if custom cell context is passed, that value will be used as cell context', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(LOCAL_DRIVER);

    const cellCtx = await localDriver.container.resolve<CellContext>(CellContext);

    expect(cellCtx).to.instanceOf(CellContext);
    expect(cellCtx.cellName).to.equal('User');
  });

  // it('custom cell context can leverage @cellularjs/di for dependency injection', async () => {
  //   await createNetWork([userCellCnf]);

  //   const resolvedCell = getResolvedCell('User');
  //   const localDriver = resolvedCell.drivers.get(LOCAL_DRIVER);

  //   const cellCtx = await localDriver.container.resolve<CellContext>(CellContext);

  //   expect(cellCtx.jwtService).to.instanceOf(JwtService);
  // });
});