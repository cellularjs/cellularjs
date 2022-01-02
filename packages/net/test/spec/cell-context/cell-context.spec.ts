import 'mocha';
import { expect } from 'chai';
import { createNetWork, getResolvedCell, CellContext } from '../../../src';
import { cleanNetwork } from '../../../src/internal';
import { authCellCnf, userCellCnf } from '../../fixture/share/network';

describe('CellContext:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('each cell will have will have it own CellContext', async () => {
    await createNetWork([authCellCnf, userCellCnf]);

    const authCellContext = getResolvedCell('Auth').cellContext;
    const userCellContext = getResolvedCell('User').cellContext;

    expect(authCellContext).to.instanceOf(CellContext);
    expect(authCellContext.cellName).to.equal('Auth');

    expect(userCellContext).to.instanceOf(CellContext);
    expect(userCellContext.cellName).to.equal('User');
  });
});
