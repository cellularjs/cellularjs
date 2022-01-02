import 'mocha';
import { expect } from 'chai';
import { LOCAL_DRIVER, createNetWork, getResolvedCell } from '../../../src';
import { cleanNetwork } from '../../../src/internal';
import { userCellCnf } from '../../fixture/share/network';

describe('Network - getResolvedCell:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('can use cell name to get resolved cell', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');

    expect(resolvedCell.cellConfig).to.eqls(userCellCnf);
    expect(resolvedCell.drivers.has(LOCAL_DRIVER)).to.true;
  });

  it('will return undefined if resolved cell is not exist', async () => {
    const resolvedCell = getResolvedCell('NotExist');

    expect(resolvedCell).to.undefined;
  });
});
