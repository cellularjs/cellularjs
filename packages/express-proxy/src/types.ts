import { Request, Response, NextFunction } from 'express';
import { IRQ, IRS, ToTargetHeader } from '@cellularjs/net';

interface ExpressContext {
  req: Request;
  res: Response;
  next: NextFunction;
}

interface CellularContext {
  irq: IRQ;
  irs: IRS;
}

export type InputTransform = (req: Request, proxyTo: ToTargetHeader) => IRQ;

export type OutputTransform = (
  expressCtx: ExpressContext,
  cellularCtx: CellularContext,
) => any;

export interface ProxyConfig {
  inputTransform: InputTransform;
  outputTransform: OutputTransform;
}

export interface Transporter {
  send(irq: IRQ): Promise<IRS>;
}
