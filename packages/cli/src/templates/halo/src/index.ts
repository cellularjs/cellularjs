import * as express from 'express';
import { createNetWork, send, IRQ, IRS } from '@cellularjs/net';
import { NetworkConfig } from '@cellularjs/net';
import { HelloCell } from './hello.cell';

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

  app.listen(3001, () => console.log('Ready for http request (port: 3001)'));
})();
