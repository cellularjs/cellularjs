import { Errors } from "../";
import { NetworkConfig, CellConfig, ResolvedCell } from "../type";
import { uniqId } from "../utils";
import { resolveDrivers } from './resolve-drivers.func'
import { ControlPlane } from "./";
import { setResolvedCell } from "./resolved-cell.prop"

export async function createNetWork(this: ControlPlane, networkConfig: NetworkConfig): Promise<void[]> {
  preventDuplicateCell(networkConfig);

  return Promise.all(networkConfig.map(
    cellConfig => resolveCell.call(this, cellConfig),
  ));
}

function preventDuplicateCell(networkConfig: NetworkConfig) {
  const allCellNames = networkConfig.map(cellConfig => cellConfig.name);

  allCellNames.every((cellName, i) => {
    if (allCellNames.indexOf(cellName) === i) {
      return true;
    }

    throw Errors.DuplicateCellName(cellName);
  });
}

async function resolveCell(this: ControlPlane, cellConfig: CellConfig): Promise<void> {
  const resolvedCell: ResolvedCell = {
    drivers: await resolveDrivers(cellConfig),
    spaceId: uniqId(cellConfig.space),
    cellId: uniqId(cellConfig.name),
    cellConfig,
  };

  setResolvedCell(cellConfig.name, resolvedCell);
}