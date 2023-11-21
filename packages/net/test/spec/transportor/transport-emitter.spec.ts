import { expect } from 'chai';
import {
  createNetWork,
  transportListener,
  TransportListener,
  send,
  IRQ,
} from '../../../src';
import { clearNetwork } from '../../../src/internal';
import { imsNetwork } from '../../fixture/share/network';

describe('Transportor - transportListener', () => {
  beforeEach(async () => {
    await createNetWork(imsNetwork);
  });

  afterEach(async () => {
    transportListener.removeAllListeners();
    await clearNetwork();
  });

  it('is an instance of EventEmitter', () => {
    expect(transportListener).to.be.instanceOf(TransportListener);
  });

  it('can listen to "start" event when there is new requst with `on` method', async () => {
    let call = 0;

    transportListener.on('start', async (ctx) => {
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      call++;

      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    });

    transportListener.on('start', () => {
      call++;
    });

    await Promise.all([
      send(new IRQ({ to: 'Auth:SignIn' })),
      send(new IRQ({ to: 'Auth:SignIn' })),
    ]);

    expect(call).to.be.eql(4);
  });

  it('can listen to "start" event when there is new request with `once` method', async () => {
    let call = 0;

    transportListener.once('start', async (ctx) => {
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      call++;

      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    });

    transportListener.once('start', () => {
      call++;
    });

    await Promise.all([
      send(new IRQ({ to: 'Auth:SignIn' })),
      send(new IRQ({ to: 'Auth:SignIn' })),
    ]);

    expect(call).to.be.eql(2);
  });

  it('can listen to "success" event when request is fulfilled with `on` method', async () => {
    let call = 0;

    transportListener.on('success', async (ctx) => {
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      call++;

      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    });

    transportListener.on('success', () => {
      call++;
    });

    await Promise.all([
      send(new IRQ({ to: 'Auth:SignIn' })),
      send(new IRQ({ to: 'Auth:SignIn' })),
    ]);

    expect(call).to.be.eql(4);
  });

  it('can listen to "success" event when request is fulfilled with `once` method', async () => {
    let call = 0;

    transportListener.once('success', (ctx) => {
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      call++;

      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    });

    transportListener.once('success', () => {
      call++;
    });

    await Promise.all([
      send(new IRQ({ to: 'Auth:SignIn' })),
      send(new IRQ({ to: 'Auth:SignIn' })),
    ]);

    expect(call).to.be.eql(2);
  });

  it('can listen to "fail" event when there is error with `on` method', async () => {
    let call = 0;

    transportListener.on('fail', async (ctx) => {
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).not.undefined;

      call++;

      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    });

    transportListener.on('fail', () => {
      call++;
    });

    try {
      await send(new IRQ({ to: 'Auth:NotExist' }));
    } catch {}

    try {
      await send(new IRQ({ to: 'Auth:NotExist' }));
    } catch {}

    expect(call).to.be.eql(4);
  });

  it('can listen to "fail" event when there is error with `once` method', async () => {
    let call = 0;

    transportListener.once('fail', async (ctx) => {
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).not.undefined;

      call++;

      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    });

    transportListener.once('fail', () => {
      call++;
    });

    try {
      await send(new IRQ({ to: 'Auth:NotExist' }));
    } catch {}

    try {
      await send(new IRQ({ to: 'Auth:NotExist' }));
    } catch {}

    expect(call).to.be.eql(2);
  });
});
