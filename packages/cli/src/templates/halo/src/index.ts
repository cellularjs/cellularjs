import * as express from 'express';
import { getLogger } from '@cellularjs/logger';
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

  app.get('/', (req, res) => {
    getLogger('Express').info(`${req.url} - ${req.headers['user-agent']}`);

    const helloIrq = new IRQ({ to: 'Hello:SayHelloCmd' });
    const onComplete = (irs: IRS) => {
      res.status(irs.header.status).send(irs.body);
    };

    send(helloIrq).then(onComplete).catch(onComplete);
  });

  await createNetWork(helloNetwork);

  app.listen(env<Env>().NODE_PORT, () =>
    getLogger('Halo gateway').info(
      `ready for http request (port: ${env<Env>().NODE_PORT})`,
    ),
  );
})();
