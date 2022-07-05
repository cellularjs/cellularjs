import { Request, Response, NextFunction } from 'express';
import { IRS, ToTargetHeader } from '@cellularjs/net';
import { ProxyConfig, Transporter } from './types';

export function expressProxy(
  baseProxyCnf: ProxyConfig,
  transporter: Transporter,
) {
  return (proxyTo: ToTargetHeader, subProxyCnf?: Partial<ProxyConfig>) => {
    const inputTransform =
      subProxyCnf?.inputTransform || baseProxyCnf.inputTransform;

    const outputTransform =
      subProxyCnf?.outputTransform || baseProxyCnf.outputTransform;

    return async (req: Request, res: Response, next: NextFunction) => {
      const irq = inputTransform(req, proxyTo);

      let irs: IRS;

      try {
        irs = await transporter.send(irq);
      } catch (err) {
        irs = err;
      }

      outputTransform({ req, res, next }, { irq, irs });
    };
  };
}
