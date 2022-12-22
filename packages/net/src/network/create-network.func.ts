import { CellContext, CellConfig } from '..';
import { Errors } from '../internal';
import { NetworkConfig, ResolvedCell } from '../type';
import { uniqId, freezeProperty } from '../utils';
import { resolveDrivers } from './resolve-drivers.func';
import { setResolvedCell } from './resolved-cell.data';

export async function createNetWork(
  networkConfig: NetworkConfig,
): Promise<void> {
  preventDuplicateCell(networkConfig);

  for (let i = 0; i < networkConfig.length; i++) {
    await resolveCell(networkConfig[i]);
  }
}

function preventDuplicateCell(networkConfig: NetworkConfig) {
  const allCellNames = networkConfig.map((cellConfig) => cellConfig.name);

  allCellNames.every((cellName, i) => {
    if (allCellNames.indexOf(cellName) === i) {
      return true;
    }

    throw Errors.DuplicateCellName(cellName);
  });
}

async function resolveCell(cellConfig: CellConfig): Promise<void> {
  const resolvedCell: ResolvedCell = {
    drivers: await resolveDrivers(cellConfig),
    spaceId: uniqId(cellConfig.space),
    cellId: uniqId(cellConfig.name),
    cellConfig,
    cellContext: createCellContext(cellConfig),
  };

  setResolvedCell(cellConfig.name, resolvedCell);
}

function createCellContext(cellConfig: CellConfig) {
  const cellCtx = new CellContext();

  freezeProperty(cellCtx, 'cellName', cellConfig.name);

  return cellCtx;
}
