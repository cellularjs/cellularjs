import { EventEmitter } from 'events';
import { RequestContext } from './request-context';

/**
 * IMPORTANT: `transportEmitter` is a **GLOBAL** EventEmitter object. That mean listener(callback)
 * will be able to listen to every request events from different cells. So it is only suitable for
 * "global" tasks such as logging request,... and code should be placed at common place(Eg: `$share` folder).
 * 
 * OTHER: If you want to modify/add behaviour for specific service, have a look at
 * [service proxy](https://cellularjs.com/docs/foundation/net/service#41-addserviceproxies).
 */
export const transportEmitter = new EventEmitter() as TransportEmitter;

type RequestListener = (ctx: RequestContext) => void;

/**
 * Valid request event that may be emitted by CellularJS.
 */
type RequestEvent = 'start' | 'success' | 'fail';

interface TransportEmitter {
  on(event: RequestEvent, listener: RequestListener): this;
  once(event: RequestEvent, listener: RequestListener);
  emit(event: RequestEvent, ctx: RequestContext): boolean;
  removeAllListeners(event?: RequestEvent): this;
  // addListener(event: RequestEvent, listener: RequestListener);
  // off(event: RequestEvent, listener: RequestListener): this;
  // removeListener(event: RequestEvent, listener: RequestListener): this;
  // listeners(event: RequestEvent): Function[];
  // rawListeners(event: RequestEvent): Function[];
  // listenerCount(event: RequestEvent): number;
  // prependListener(event: RequestEvent, listener: RequestListener): this;
  // prependOnceListener(event: RequestEvent, listener: RequestListener): this;
}
