import 'mocha';
import { expect } from 'chai';
import { createNetWork, send, IRQ, NetErrorCode, IRS } from '../../../src';
import { cleanNetwork } from '../../../src/internal';
import { imsNetwork } from '../../fixture/share/network';

describe('Transportor - send(): send request', () => {
  beforeEach(async () => {
    await createNetWork(imsNetwork);
  });

  afterEach(async () => {
    await cleanNetwork();
  });

  it('will throw error in case of sending request to non-exist cell', async () => {
    try {
      const irq = new IRQ({ to: 'NotExist:Bar' });
      await send(irq);

      expect(true).to.false;
    } catch (err) {
      expect(err.header.status === 500).to.true;
    }

    try {
      const irq = new IRQ({ to: 'NotExist:Bar' });
      await send(irq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.NoResolvedCell);
    }
  });

  it('will re-throw IRS object if client throw it', async () => {
    try {
      const irq = new IRQ({ to: 'User:CreateProfile' });
      await send(irq);

      expect(true).to.false;
    } catch (err) {
      expect(err.header.status === 400).to.true;
    }

    try {
      const irq = new IRQ({ to: 'User:CreateProfile' });
      await send(irq);

      expect(true).to.false;
    } catch (err) {
      expect(err).to.instanceOf(IRS);
    }
  });

  it('if driver is not exist, it will throw error', async () => {
    try {
      const irq = new IRQ({ to: 'User:CreateProfile' });
      await send(irq, { driver: 'not exist' });

      expect(true).to.false;
    } catch (err) {
      expect(err.header.status === 500).to.true;
    }

    try {
      const irq = new IRQ({ to: 'User:CreateProfile' });
      await send(irq, { throwOriginalError: true, driver: 'not exist' });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.NoResolvedDriver);
    }
  });

  it('if service handler is not exist, it will throw error', async () => {
    try {
      const irq = new IRQ({ to: 'User:not-exist' });
      await send(irq);

      expect(true).to.false;
    } catch (err) {
      expect(err.header.status === 500).to.true;
    }

    try {
      const irq = new IRQ({ to: 'User:not-exist' });
      await send(irq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.NoServiceHandler);
    }
  });

  it('if event handler scope is private, it is accessible from owner cell', async () => {
    const renderHtmlIrq = new IRQ({ to: 'IMS:RenderHtml' });

    const renderHtmlIrs = await send(renderHtmlIrq, {
      throwOriginalError: true,
    });

    expect(renderHtmlIrs.body.cached).to.equal(true);
  });

  it('if event handler scope is private, it is not accessible from other cells', async () => {
    const renderHtmlIrq = new IRQ({ to: 'User:DelegateCacheHtml' });

    try {
      await send(renderHtmlIrq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.OtherCellAccessPrivateService);
    }
  });

  it('if event handler scope is private, it is not accessible from anonymous caller', async () => {
    const cacheHtmlIrq = new IRQ({ to: 'IMS:CacheHtml' });

    try {
      await send(cacheHtmlIrq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.AnonymousAccessPrivateService);
    }
  });

  it('if event handler scope is space, it is accessible from cells having same space', async () => {
    const signUpIrq = new IRQ(
      { to: 'User:CreateProfile' },
      { usr: 'foo', pwd: '***********' },
    );

    await send(signUpIrq);
  });

  it('if event handler scope is space, it is not accessible from cells having different space', async () => {
    const irq = new IRQ({ to: 'IMS:DelegateSendMail' });

    try {
      await send(irq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.SpaceScopeForbidden);
    }
  });

  it('if event handler scope is space, it is not accessible from anonymous caller', async () => {
    const irq = new IRQ({ to: 'User:SendMail' });

    try {
      await send(irq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.AnonymousAccessSpaceService);
    }
  });

  it("if event handler scope is space, it is not accessible from cells that don't have same space", async () => {
    const irq = new IRQ({ to: 'IMS:DelegateSendMail' });

    try {
      await send(irq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.SpaceScopeForbidden);
    }
  });

  it('if scope is publish, event handler is accessible from every cells', async () => {
    const delegateSignInIrq = new IRQ({ to: 'User:DelegateSignIn' });

    const delegateSignInIrs = await send(delegateSignInIrq);

    expect(delegateSignInIrs.header.status).to.equal(200);
  });

  it('if scope is publish, event handler is accessible from anonymous caller', async () => {
    const signInIrq = new IRQ({ to: 'Auth:SignIn' });

    const signInIrs = await send(signInIrq);

    expect(signInIrs.header.status).to.equal(200);
  });

  it("if event handler don't specify scope then default scope is space", async () => {
    const delegateUnlockAccountIrq = new IRQ({
      to: 'IMS:DelegateUnlockAccount',
    });

    try {
      await send(delegateUnlockAccountIrq, { throwOriginalError: true });

      expect(true).to.false;
    } catch (err) {
      expect(err.code).to.equal(NetErrorCode.SpaceScopeForbidden);
    }
  });
});
