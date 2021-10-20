import {
  CellContext, CellularIRQ, CellularIRS,
  DEFAULT_DRIVER,
} from '..';
import { resolveServiceHandler } from './resolve-service-handler.func'

interface RequestOptions {
  refererCell?: CellContext;

  /**
   * By default, driver type is 'local'
   */
  driverType?: string;

  // By default, all exception will be treated as error response(without throwing).
  // This flag is helpfull for debugging.
  throwOnError?: boolean;
}

export async function send(irq: CellularIRQ, opts?: RequestOptions): Promise<CellularIRS> {
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

    if (error instanceof CellularIRS) {
      return error;
    }

    return CellularIRS.unexpectedError();
  }
}
