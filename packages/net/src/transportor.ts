import { CellContext } from "./";
import { CellularIRQ, CellularIRS, ControlPlane, TRANSPORTOR_EVENT, CLL_CELL_CTX, CLL_IRQ } from "./index";

export class Transportor {
  public static async send(irq: CellularIRQ, driverType: any = 'local', refererCell: CellContext = undefined): Promise<CellularIRS> {
    try {
      Interceptor.emit(TRANSPORTOR_EVENT.RequestStart, irq, refererCell);

      const eventHandler = this._resolveEventHandler(irq, driverType);
      const cellularIRS = await eventHandler.handle();

      Interceptor.emit(TRANSPORTOR_EVENT.RequestEnd, irq, refererCell);

      return cellularIRS;
    } catch (error) {
      Interceptor.emit(TRANSPORTOR_EVENT.RequestFailed, irq, refererCell, error);

      if (error instanceof CellularIRS) {
        return CellularIRS.standardIrsError(error, irq);
      }

      return CellularIRS.standardUnexpectedError(irq);
    }
  }

  private static _resolveEventHandler(irq: CellularIRQ, driverType: string): any {
    const [targetCellName, eventKey] = irq.header.to.split(":");
    const resolvedCell = ControlPlane.getResolvedCell(targetCellName);

    if (!resolvedCell) {
      throw new Error(`There is no resolved cell(${targetCellName}) for '${driverType}' driver`)
    }

    if (!resolvedCell.resolvedDriver[driverType]) {
      throw new Error(`There is no resolved driver(${driverType}) for sending request to '${irq.header.to}'`)
    }

    const TargetEventHandler = resolvedCell.resolvedDriver[driverType].listen[eventKey];
    if (!TargetEventHandler) {
      throw new Error(`Event handler(driver: ${driverType}) is not defined for '${irq.header.to}'`)
    }

    const ctxInstance = resolvedCell.resolvedDriver[driverType].context;

    return ctxInstance.container.resolveWithProviders(TargetEventHandler, [
      { token: CLL_CELL_CTX, useValue: ctxInstance },
      { token: CLL_IRQ, useValue: irq },
    ]);
  }
}