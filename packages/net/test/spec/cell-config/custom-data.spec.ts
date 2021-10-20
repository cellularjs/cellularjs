import 'mocha';
import { expect } from 'chai';
import { createNetWork, cleanNetwork, getResolvedCell } from '../../../src';
import { userCellCnf } from '../../fixture/share/network';

describe('CellConfig - cell custom data:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('can add custom data to cell config', async () => {
    const customData = {
      foo: 'bar',
    };

    await createNetWork([
      { ...userCellCnf, customData },
    ]);

    const resolvedCell = getResolvedCell('User');

    expect(resolvedCell.cellConfig.customData).to.eqls(customData);
  });

});