import 'mocha';
import { expect } from 'chai';
import { createNetWork, getResolvedCell, clearNetwork } from '../../../src';
import { imsNetwork } from '../../fixture/share/network';

describe('CellConfig - cell space:', () => {
  beforeEach(async () => {
    await clearNetwork();
  });

  it('space is comparable', async () => {
    await createNetWork(imsNetwork);

    const authCell = getResolvedCell('Auth');
    const userCell = getResolvedCell('User');
    const imsCell = getResolvedCell('IMS');

    expect(authCell.cellConfig.space === userCell.cellConfig.space).to.true;
    expect(authCell.spaceId === userCell.spaceId).to.true;
    expect(imsCell.cellConfig.space === userCell.cellConfig.space).to.false;
    expect(imsCell.spaceId === userCell.spaceId).to.false;
  });
});
