import 'mocha';
import { expect } from 'chai';
import { Container, getInjectable } from '../../../src';
import { Connection } from '../../fixture/pkg/mongo/connection';

describe('Annotation - Injectable(): decorate a class to make its dependencies injectable', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('can decorate a class to make its dependencies in constructor become injectable', async () => {
    await container.addProviders([
      { token: Connection, useClass: Connection },
      { token: 'mongoUrl', useValue: 'mongodb://neverland' },
      { token: 'mongoUsr', useValue: 'guest' },
      { token: 'mongoPwd', useValue: '*********' },
    ]);

    const connection = await container.resolve<Connection>(Connection);

    expect(connection.mongoUrl).to.equal('mongodb://neverland');
    expect(connection.mongoUsr).to.equal('guest');
    expect(connection.mongoPwd).to.equal('*********');
  });

  it('can be detected as cellularjs injectable', () => {
    expect(getInjectable(Connection)).to.true;
  });
});
