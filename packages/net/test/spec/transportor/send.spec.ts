import 'mocha';
import { expect } from 'chai';
import { createNetWork, cleanNetwork, send, CellularIRQ, ErrorCode, CellularIRS } from '../../../src';
import { imsNetwork } from '../../fixture/share/network'

describe('Transportor - send(): send request', () => {
  beforeEach(async () => {
    await createNetWork(imsNetwork);
  });

  afterEach(async () => {
    await cleanNetwork();
  })

  it('will return/throw error in case of sending request to non-exist cell', async () => {
    const irq = new CellularIRQ({ unicast: 'NotExist:Bar' });
    const irs = await send(irq);
    expect(irs.header.status === 500000).to.true;

    try {
      const irq = new CellularIRQ({ unicast: 'NotExist:Bar' });
      await send(irq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.NoResolvedCell);
    }
  });

  it('will return/throw CellularIRS object if it throw CellularIRS object', async () => {
    const irq = new CellularIRQ({ unicast: 'User:CreateProfile' }, { shouldThrow: true });
    const rs = await send(irq);
    expect(rs.header.status === 400000).to.true;

    try {
      const irq = new CellularIRQ({ unicast: 'User:CreateProfile' }, { shouldThrow: true });
      await send(irq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err).to.instanceOf(CellularIRS);
    }
  });

  it('if driver is not exist, it will return/throw error', async () => {
    const irq = new CellularIRQ({ unicast: 'User:CreateProfile' });
    const irs = await send(irq, { driverType: 'not exist' });
    expect(irs.header.status === 500000).to.true;

    try {
      const irq = new CellularIRQ({ unicast: 'User:CreateProfile' });
      await send(irq, { throwOnError: true, driverType: 'not exist' });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.NoResolvedDriver);
    }
  });

  it('if service handler is not exist, it will return/throw error', async () => {
    const irq = new CellularIRQ({ unicast: 'User:not-exist' });
    const irs = await send(irq);
    expect(irs.header.status === 500000).to.true;

    try {
      const irq = new CellularIRQ({ unicast: 'User:not-exist' });
      await send(irq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.NoServiceHandler);
    }
  });

  it('if event handler scope is private, it is accessible from owner cell', async () => {
    const renderHtmlIrq = new CellularIRQ(
      { unicast: 'IMS:RenderHtml' },
    );

    const renderHtmlIrs = await send(renderHtmlIrq);

    expect(renderHtmlIrs.body.cached).to.equal(true);
  });

  it('if event handler scope is private, it is not accessible from other cells', async () => {
    const renderHtmlIrq = new CellularIRQ(
      { unicast: 'User:DelegateCacheHtml' },
    );

    try {
      await send(renderHtmlIrq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.OtherCellAccessPrivateService);
    }
  });

  it('if event handler scope is private, it is not accessible from anonymous caller', async () => {
    const cacheHtmlIrq = new CellularIRQ(
      { unicast: 'IMS:CacheHtml' },
    );

    try {
      await send(cacheHtmlIrq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.AnonymousAccessPrivateService);
    }
  });

  it('if event handler scope is space, it is accessible from cells having same space', async () => {
    const signUpIrq = new CellularIRQ(
      { unicast: 'User:CreateProfile' },
      { usr: 'foo', pwd: '***********' },
    );

    await send(signUpIrq);
  });

  it('if event handler scope is space, it is not accessible from cells having different space', async () => {
    const irq = new CellularIRQ(
      { unicast: 'IMS:DelegateSendMail' },
    );

    try {
      await send(irq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.SpaceScopeForbidden);
    }
  });

  it('if event handler scope is space, it is not accessible from anonymous caller', async () => {
    const irq = new CellularIRQ(
      { unicast: 'User:SendMail' },
    );

    try {
      await send(irq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.AnonymousAccessSpaceService);
    }
  });

  it('if event handler scope is space, it is not accessible from cells that don\'t have same space', async () => {
    const irq = new CellularIRQ(
      { unicast: 'IMS:DelegateSendMail' },
    );

    try {
      await send(irq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.SpaceScopeForbidden);
    }
  });

  it('if scope is public, event handler is accessible from every cells', async () => {
    const delegateSignInIrq = new CellularIRQ(
      { unicast: 'User:DelegateSignIn' },
    );

    const delegateSignInIrs = await send(delegateSignInIrq);

    expect(delegateSignInIrs.header.status).to.equal(200000);
  });

  it('if scope is public, event handler is accessible from anonymous caller', async () => {
    const signInIrq = new CellularIRQ(
      { unicast: 'Auth:SignIn' },
    );

    const signInIrs = await send(signInIrq);

    expect(signInIrs.header.status).to.equal(200000);
  });

  it('if event handler don\'t specify scope then default scope is space', async () => {
    const delegateUnlockAccountIrq = new CellularIRQ(
      { unicast: 'IMS:DelegateUnlockAccount' },
    );

    try {
      await send(delegateUnlockAccountIrq, { throwOnError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(ErrorCode.SpaceScopeForbidden);
    }
  });
});