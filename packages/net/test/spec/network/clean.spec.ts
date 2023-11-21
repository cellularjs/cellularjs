import 'mocha';
import { expect } from 'chai';
import { createNetWork, getResolvedCell } from '../../../src';
import { clearNetwork } from '../../../src/internal';
import { userCellCnf } from '../../fixture/share/network';

describe('Network - clearNetwork:', () => {
  beforeEach(async () => {
    await clearNetwork();
  });

  it('can run clean many times without any problem', async () => {
    await clearNetwork();
    await clearNetwork();
  });

  it('can remove resolved cells', async () => {
    await createNetWork([userCellCnf]);
    await clearNetwork();

    const userCell = getResolvedCell('User');
    expect(userCell).to.undefined;
  });
});
