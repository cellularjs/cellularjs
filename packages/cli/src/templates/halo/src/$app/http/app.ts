import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { IRS, transportListener } from '@cellularjs/net';
import { getLogger } from '@cellularjs/logger';
import { createServer } from 'http';
import { configRoutes } from './routes';
import { initNetwork } from './net';

export async function initApp() {
  await initNetwork();

  const app = express();
  const httpServer = createServer(app);
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  configRoutes(app);

  return httpServer;
}

transportListener.on('fail', (ctx) => {
  if (!(ctx.originalError instanceof IRS)) {
    getLogger(ctx.irq.header.to).error(
      ctx.originalError?.stack || ctx.originalError,
    );
    return;
  }

  // if (ctx.originalError.header.status < 400) return;
  const body = ctx.originalError.body;
  body.errors && delete body.errors;

  getLogger(ctx.irq.header.to).error(JSON.stringify(body));
});
