import 'mocha';
import { expect } from 'chai';
import { createNetWork, getResolvedCell } from '../../../src';
import { cleanNetwork } from '../../../src/internal';
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