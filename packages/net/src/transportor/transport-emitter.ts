import Emittery from 'emittery';
import { RequestContext } from './request-context';

type RequestListener = (ctx: RequestContext) => Promise<any> | any;

/**
 * Valid request event that may be emitted by CellularJS.
 */
type RequestEvent = 'start' | 'success' | 'fail';

const emitter = new Emittery();

export class TransportListener {
  on(event: RequestEvent, listener: RequestListener) {
    emitter.on(event, listener);
  }

  once(event: RequestEvent, listener: RequestListener) {
    emitter.once(event).then(listener);
  }

  removeAllListeners(event?: RequestEvent) {
    emitter.clearListeners(event);
  }
}

export async function emitTransportEvent(event: RequestEvent, ctx: RequestContext) {
  await emitter.emitSerial(event, ctx);
}

/**
 * IMPORTANT: `transportListener` is a **GLOBAL** object. That mean listener(callback)
 * will be able to listen to every request events from different cells. So it is only suitable for
 * "global" tasks such as logging request,... and code should be placed at common place(Eg: `$share` folder).
 * 
 * OTHER: If you want to modify/add behaviour for specific service, have a look at
 * [service proxy](https://cellularjs.com/docs/foundation/net/service#41-addserviceproxies).
 */
export const transportListener = new TransportListener();
