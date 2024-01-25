import { IRS, ServiceFactory } from '@cellularjs/net';
import { SayHelloQry } from './say-hello.qry';

describe('User:SayHelloQry', () => {
  test('resolve service', async () => {
    const helloQry = await ServiceFactory.resolve(SayHelloQry);

    expect(helloQry).toBeInstanceOf(SayHelloQry);
    expect(await helloQry.handle()).toBeInstanceOf(IRS);
  });
});
