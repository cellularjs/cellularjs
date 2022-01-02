import { IRQ, IRS } from '..';
import { RequestOptions } from './type';

export interface RequestContext {
  irq: IRQ;
  irs?: IRS;
  reqOpts?: RequestOptions;
  originalError?: any;
  [extKey: string]: any;
}

export class RequestContext {}
