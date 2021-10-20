import 'mocha';
import { expect } from 'chai';
import { createNetWork, cleanNetwork, getResolvedCell } from '../../../src';
import { userCellCnf } from '../../fixture/share/network';

describe('Network - cleanNetwork:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('can run clean many times without any problem', async () => {
    await cleanNetwork();
    await cleanNetwork();
  })

  it('can remove resolved cells', async () => {
    await createNetWork([userCellCnf]);
    await cleanNetwork();
  
    const userCell = getResolvedCell('User');
    expect(userCell).to.undefined;
  })
});