import { expect } from 'chai';
import { EventEmitter } from 'events';
import { createNetWork, cleanNetwork, transportEmitter, send, IRQ } from '../../../src';
import { imsNetwork } from '../../fixture/share/network'

describe('Transportor - transportEmitter', () => {
  beforeEach(async () => {
    await createNetWork(imsNetwork);
  });

  afterEach(async () => {
    transportEmitter.removeAllListeners();
    await cleanNetwork();
  });

  it('is an instance of EventEmitter', () => {
    expect(transportEmitter).to.be.instanceOf(EventEmitter);
  })

  it('can listen to "start" event when there is new requst with `on` method', (done) => {
    transportEmitter.on('start', (ctx) =>{
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      done();
    });

    send(new IRQ({ to: 'Auth:SignIn' }));
  });

  it('can listen to "start" event when there is new requst with `once` method', (done) => {
    transportEmitter.once('start', (ctx) =>{
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      done();
    });

    send(new IRQ({ to: 'Auth:SignIn' }));
  });

  it('can listen to "success" event when request is fulfilled with `on` method', (done) => {
    transportEmitter.on('success', (ctx) =>{
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      done();
    });

    send(new IRQ({ to: 'Auth:SignIn' }));
  });

  it('can listen to "success" event when request is fulfilled with `once` method', (done) => {
    transportEmitter.once('success', (ctx) =>{
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).undefined;

      done();
    });

    send(new IRQ({ to: 'Auth:SignIn' }));
  });

  it('can listen to "fail" event when there is error with `on` method', (done) => {
    transportEmitter.on('fail', (ctx) =>{
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).not.undefined;

      done();
    });

    send(new IRQ({ to: 'Auth:NotExist' }));
  });

  it('can listen to "fail" event when there is error with `once` method', (done) => {
    transportEmitter.once('fail', (ctx) =>{
      expect(ctx.irq).not.undefined;
      expect(ctx.irs).not.undefined;
      expect(ctx.reqOpts).not.undefined;
      expect(ctx.originalError).not.undefined;

      done();
    });

    send(new IRQ({ to: 'Auth:NotExist' }));
  });
});