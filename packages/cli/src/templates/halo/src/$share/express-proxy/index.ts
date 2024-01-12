import { IRQ, ToTargetHeader, send } from '@cellularjs/net';
import { expressProxy, InputTransform, OutputTransform, ProxyConfig } from '@cellularjs/express-proxy';
import { getLogger } from '@cellularjs/logger';

const inputTransform: InputTransform = (req, proxyTo) => {
  const logger = getLogger('ExpressProxy');

  const irq = new IRQ(
    { to: proxyTo },
    { ...req.query, ...req.params, ...req.body },
  );

  logger.info(`${req.method} ${req.baseUrl + req.path} => ${proxyTo}`);

  return irq;
};

const outputTransform: OutputTransform = (expressCtx, cellularCtx) => {
  const { res } = expressCtx;
  const { irs } = cellularCtx;

  if (irs.header.status === 302) {
    res.redirect(irs.header.location);
    return;
  }

  res.status(irs.header?.status || 500).json(irs.body);
};

export const proxyTo = (
  proxyTo: ToTargetHeader,
  subProxy?: Partial<ProxyConfig>,
) => expressProxy(
  { inputTransform, outputTransform },
  {
    send: (irq) => send(irq),
  },
)(proxyTo, subProxy);
