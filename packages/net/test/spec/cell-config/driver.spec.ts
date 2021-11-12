import 'mocha';
import { expect } from 'chai';
import { CellConfig, LOCAL_DRIVER, createNetWork, cleanNetwork, getResolvedCell, ErrorCode } from '../../../src';
import { authCellCnf, userCellCnf } from '../../fixture/share/network';

describe('CellConfig - cell driver:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('can not resolve driver which is not decorated by @Cell annotation', async () => {
    try {
      class DummyClass {}
      const invalidCellClassCnf: CellConfig = {
        driver: DummyClass,
        name: 'DummyClass',
        space: 'DummyClass',
      };

      await createNetWork([invalidCellClassCnf]);

      expect(true).to.false;
    } catch(err) {
      expect(err.code).to.equal(ErrorCode.InvalidDriverClass);
    }
  });

  it('driver config is a string will be treated as local driver', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');

    expect(resolvedCell.cellConfig).to.eqls(userCellCnf);
    expect(resolvedCell.drivers.has(LOCAL_DRIVER)).to.true;
  });

  it('can add a cell which has multiple types of driver into network', async () => {
    await createNetWork([authCellCnf]);

    const resolvedCell = getResolvedCell('Auth');

    expect(resolvedCell.cellConfig).to.eqls(authCellCnf);
    expect(resolvedCell.drivers.has(LOCAL_DRIVER)).to.true;
    expect(resolvedCell.drivers.has('http')).to.true;
  });
});