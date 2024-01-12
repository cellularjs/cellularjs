import { SayHelloQry } from './say-hello.qry';

describe('User:UserGreetQry', () => {
  test('hello', async () => {
    expect(SayHelloQry).toBeTruthy();
  });
});
