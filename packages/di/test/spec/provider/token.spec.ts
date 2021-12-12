import 'mocha';
import { expect } from 'chai';
import { Container, DiErrorCode } from '../../../src';
import { request } from '../../fixture/const/data.const';
import { CreateProfileReq } from '../../fixture/user/services/create-profile.req';
import { MongoService } from '../../fixture/pkg/mongo/mongo.service';

let container: Container;

beforeEach(() => {
  container = new Container();
});

describe('Provider - token: unique identifier for provider inside a container', () => {
  it('can be a string', async () => {
    await container.addProvider({ token: 'foo', useValue: 'bar' });

    expect(await container.resolve('foo')).to.equal('bar');
  });

  it('can be a number', async () => {
    await container.addProvider({ token: 1, useValue: 'foo' });
    await container.addProvider({ token: 1.1, useValue: 'bar' });

    expect(await container.resolve(1)).to.equal('foo');
    expect(await container.resolve(1.1)).to.equal('bar');
  });

  it('can be an object', async () => {
    const foo = {}, bar = {};
    await container.addProviders([
      { token: foo, useValue: 'foo' },
      { token: bar, useValue: 'bar' },
    ]);

    expect(await container.resolve(foo)).to.equal('foo');
    expect(await container.resolve(bar)).to.equal('bar');
  });

  it('can be a Symbol', async () => {
    const symToken = Symbol();
    await container.addProvider({ token: symToken, useValue: 'bar' });

    const actualResult = await container.resolve(symToken);
    expect(actualResult).to.equal('bar');
  });

  it('can be a class', async () => {
    await container.addProvider({ token: MongoService, useValue: 'foo' });

    const actualResult = await container.resolve(MongoService);

    expect(actualResult).to.equal('foo');
  });

  it('can not be duplicated', async () => {
    const addProviderFunc = () => container.addProvider({ token: 'foo', useValue: 'foo' });
    await addProviderFunc();

    try {
      await addProviderFunc();

      expect(true).to.be.false;
    } catch(err) {
      expect(err.code).to.eql(DiErrorCode.DuplicateToken)
    }
  });

  it('can not use duplicate Symbol as token', async () => {
    const mockReq = { name: 'X', age: 99 };
    try {
      await container.addProviders([
        CreateProfileReq,
        { token: request, useValue: mockReq },
        { token: request, useValue: mockReq },
      ]);

      expect(true).to.be.false;
    } catch (err) {
      expect(err.code).to.eql(DiErrorCode.DuplicateToken);
    }
  });
});