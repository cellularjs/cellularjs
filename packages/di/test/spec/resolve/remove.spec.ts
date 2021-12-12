import 'mocha';
import { expect } from 'chai';
import { Container } from '../../../src';

describe('Container - remove:', () => {
  it('can remove existing provider from container', async () => {
    const container = new Container();
    await container.addProviders([
      { token: 'foo', useValue: 'bar' },
    ]);

    container.remove('foo');

    expect(container.has('foo')).to.be.false;
  });
});