import 'mocha';
import { expect } from 'chai';
import { LOCAL_DRIVER, createNetWork, cleanNetwork, getResolvedCell } from '../../../../src';
import { userCellCnf } from '../../../fixture/share/network';
import { JwtService } from '../../../fixture/pkg/jwt/jwt.service';

describe('Decorator - @Cell annotation - imports property:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('can make use of @cellularjs/di to add module', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(LOCAL_DRIVER);

    const jwtService = await localDriver.container.resolve<JwtService>(JwtService);

    expect(jwtService).to.instanceOf(JwtService);
  });
});