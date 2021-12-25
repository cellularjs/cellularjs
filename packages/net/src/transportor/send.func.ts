import { IRQ, IRS, LOCAL_DRIVER } from '..';
import { emitTransportEvent } from './transport-emitter';
import { resolveServiceHandler } from './resolve-service-handler.func';
import { RequestContext } from './request-context';
import { RequestOptions } from './type';

export async function send(irq: IRQ, rawOpts?: RequestOptions): Promise<IRS> {
  const reqOpts = ajustOptions(rawOpts);
  const { refererCell, throwOriginalError, driver } = reqOpts;

  const requestCtx = new RequestContext();
  requestCtx.irq = irq;
  requestCtx.reqOpts = reqOpts;

  try {
    await emitTransportEvent('start', requestCtx);

    const serviceHandler = await resolveServiceHandler(irq, refererCell, driver);
    const irs = await serviceHandler.handle();

    requestCtx.irs = irs instanceof IRS ? irs : new IRS({ status: 200 }, irs);

    await emitTransportEvent('success', requestCtx);

    return requestCtx.irs;
  } catch (error) {
    requestCtx.originalError = error;
    requestCtx.irs = error instanceof IRS ? error : IRS.unexpectedError();

    await emitTransportEvent('fail', requestCtx);

    if (throwOriginalError) throw error;

    throw requestCtx.irs;
  }
}

function ajustOptions(rawOpts: RequestOptions) {
  if (!rawOpts) {
    return {
      driver: LOCAL_DRIVER,
    };
  }

  return {
    ...rawOpts,
    driver: rawOpts.driver || LOCAL_DRIVER,
  }
}
