import * as express from 'express';
import { createNetWork, send, IRQ, IRS } from '@cellularjs/net';
import { NetworkConfig } from '@cellularjs/net';
import { HelloCell } from './hello.cell';

const nodePort = process.env.NODE_PORT;

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

  app.listen(nodePort, () =>
    console.log(`Halo gateway: ready for http request (port: ${nodePort})`),
  );
})();
