import { Injectable } from '@cellularjs/di';
import { IRQ } from '../../../../../src';

@Injectable()
export class BarRequest {
  constructor(public irq: IRQ) {}
}
