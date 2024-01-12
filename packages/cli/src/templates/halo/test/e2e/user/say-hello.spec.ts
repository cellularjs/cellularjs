describe('User:SayHelloQry', () => {
  test('Say hello', async () => {
    await testAgent.get('/').expect(200);
  });
});
