import * as express from 'express';
import { createNetWork, send, IRQ, IRS } from '@cellularjs/net';
import { NetworkConfig } from '@cellularjs/net';
import { env } from '@cellularjs/env';
import { HelloCell } from './hello.cell';
import { Env } from './env';

const helloNetwork: NetworkConfig = [
  {
    name: 'Hello',
    driver: HelloCell,
    space: 'neverland',
  },
];

(async () => {
  const app = express();

  app.get('/', (_, res) => {
    const helloIrq = new IRQ({ to: 'Hello:SayHelloCmd' });
    const onComplete = (irs: IRS) => {
      res.status(irs.header.status).send(irs.body);
    };

    send(helloIrq).then(onComplete).catch(onComplete);
  });

  await createNetWork(helloNetwork);

  app.listen(env<Env>().NODE_PORT, () =>
    console.log(
      `Halo gateway: ready for http request (port: ${env<Env>().NODE_PORT})`,
    ),
  );
})();
