import { createNetWork } from './create-network.func'
import { getResolvedCell, cleanResolvedCells } from './resolved-cell.prop'

export class ControlPlane {
  public static readonly DEFAULT_DRIVER = 'local';

  public static createNetwork = createNetWork;

  public static getResolvedCell = getResolvedCell;

  public static clean = cleanResolvedCells;
}
