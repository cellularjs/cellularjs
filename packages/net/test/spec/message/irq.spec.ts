import { expect } from 'chai';
import { IRQ } from '../../../src';

describe('IRQ:', () => {
  it('withHeader() can create new message instance', () => {
    const message = new IRQ(null, null);
    const newMessage = message.withHeader({ foo: 'bar' });

    expect(message !== newMessage).to.true;
    expect(newMessage.header.foo).to.eq('bar');
  });

  it('withHeader() will replace all old header', () => {
    const message = new IRQ(null, { foo: 1, bar: 1 });
    const newMessage = message.withHeader({ foo: 2 });

    expect(message !== newMessage).to.true;
    expect(newMessage.header.foo).to.eq(2);
    expect(newMessage.header.bar).to.be.undefined;
  });

  it('withHeader() is chainable', () => {
    const message = new IRQ(null, null);
    const newMessage = message.withHeader({ foo: 1 }).withHeader({ foo: 2 });

    expect(message !== newMessage).to.true;
    expect(newMessage.header.foo).to.eq(2);
  });

  it('withHeaderItem() can create new message instance', () => {
    const message = new IRQ(null, null);
    const newMessage = message.withHeaderItem('foo', 'bar');

    expect(message !== newMessage).to.true;
    expect(newMessage.header.foo).to.eq('bar');
  });

  it('withHeaderItem() will replace specific header item', () => {
    const message = new IRQ({ foo: 1, bar: 1 });
    const newMessage = message.withHeaderItem('foo', 2);

    expect(message !== newMessage).to.true;
    expect(newMessage.header.foo).to.eq(2);
    expect(newMessage.header.bar).to.not.undefined;
  });

  it('withHeaderItem() is chainable', () => {
    const message = new IRQ(null, null);
    const newMessage = message
      .withHeaderItem('foo', 1)
      .withHeaderItem('foo', 2);

    expect(message !== newMessage).to.true;
    expect(newMessage.header.foo).to.eq(2);
  });

  it('withBody() can create new message instance', () => {
    const message = new IRQ(null, null);
    const newMessage = message.withBody(1);

    expect(message !== newMessage).to.true;
    expect(newMessage.body).to.eq(1);
  });

  it('withBody() is chainable', () => {
    const message = new IRQ(null, null);
    const newMessage = message.withBody('foo').withBody('bar');

    expect(message !== newMessage).to.true;
    expect(newMessage.body).to.eq('bar');
  });
});
