import { clearNetwork } from '@cellularjs/net';
import * as supertest from 'supertest';
import { initApp } from '$app/http/app';

beforeEach(async () => {
  global.server = (await initApp()).listen();
  global.testAgent = supertest(global.server);
});

afterEach(async () => {
  await clearNetwork();
  global.server.close();
});
