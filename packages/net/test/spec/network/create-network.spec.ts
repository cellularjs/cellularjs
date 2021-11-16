import 'mocha';
import { expect } from 'chai';
import { createNetWork, getResolvedCell, ErrorCode } from '../../../src';
import { cleanNetwork } from '../../../src/internal';
import { userCellCnf } from '../../fixture/share/network';

describe('Network - createNetwork:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('can create network with cell configs', async () => {
    await createNetWork([userCellCnf]);

    const userCell = getResolvedCell('User');

    expect(userCell).to.not.undefined;
  });

  it('can not use duplicate cell name', async () => {
    try {
      await createNetWork([userCellCnf, userCellCnf]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.DuplicateCellName)
    }
  });
});