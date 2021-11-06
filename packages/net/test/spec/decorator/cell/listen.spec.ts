import 'mocha';
import { expect } from 'chai';
import { DEFAULT_DRIVER, createNetWork, cleanNetwork, getResolvedCell, ErrorCode, Cell } from '../../../../src';
import { userCellCnf, authCellCnf, dummyCellCnf } from '../../../fixture/share/network';
import { CreateProfile } from '../../../fixture/cells/user/events/create-profile.event';
import { SignIn } from '../../../fixture/cells/auth/events/sign-in.event';
import { LockAccount } from '../../../fixture/cells/auth/events/sub/another-sub/lock-account';

describe('Decorator - @Cell annotation - listen property:', () => {
  beforeEach(async () => {
    await cleanNetwork();
  });

  it('listen can use key-value pair object for configuration', async () => {
    await createNetWork([userCellCnf]);

    const resolvedCell = getResolvedCell('User');
    const localDriver = resolvedCell.drivers.get(DEFAULT_DRIVER);

    const createProfileServiceHandler = localDriver.listener.get('CreateProfile');

    expect(createProfileServiceHandler === CreateProfile).to.true;
  });

  it(`if listen is a string it will be treated as folder path, 
  Net will scan whole folder(include sub folders) for event handler`, async () => {
    await createNetWork([authCellCnf]);

    const resolvedCell = getResolvedCell('Auth');
    const localDriver = resolvedCell.drivers.get(DEFAULT_DRIVER);

    const signInServiceHandler = localDriver.listener.get('SignIn');
    const lockAccountServiceHandler = localDriver.listener.get('LockAccount');

    expect(signInServiceHandler === SignIn).to.true;
    expect(lockAccountServiceHandler === LockAccount).to.true;
  });

  it(`while scanning folder for event handler,
  it will throw error if there is duplicate event handler(event name)`, async () => {
    try {
      await createNetWork([dummyCellCnf]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.DuplicateServiceHandlerName)
    }
  });

  it('will throw error if listen path is not exist', async () => {
    try {
      @Cell({ listen: './not-exist' })
      class FooCell { }

      await createNetWork([{
        name: 'Foo',
        driver: FooCell,
      }]);

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal('ENOENT')
    }
  });
});