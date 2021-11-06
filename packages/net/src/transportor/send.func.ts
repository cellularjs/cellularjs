import {
  CellContext, IRQ, IRS,
  DEFAULT_DRIVER,
} from '..';
import { resolveServiceHandler } from './resolve-service-handler.func'

interface RequestOptions {
  /**
   * `refererCell` allow CellularJS to get information of cell that send this request.
   */
  refererCell?: CellContext;

  /**
   * By default, driver type is 'local'.
   */
  driverType?: string;

  // By default, all exception will be treated as error response(without throwing).
  // This flag is helpfull for debugging.
  throwOnError?: boolean;
}

export async function send(irq: IRQ, opts?: RequestOptions): Promise<IRS> {
  const {
    refererCell,
    driverType = DEFAULT_DRIVER,
    throwOnError,
  } = opts || {};

  try {
    const eventHandler = await resolveServiceHandler(irq, refererCell, driverType);

    const irs = await eventHandler.handle();

    return irs;
  } catch (error) {
    if (throwOnError) {
      throw error;
    }

    if (error instanceof IRS) {
      return error;
    }

    return IRS.unexpectedError();
  }
}
