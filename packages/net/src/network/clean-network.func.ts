import { Hook } from '..'
import { cleanResolvedCells } from './resolved-cell.data'

export async function cleanNetwork() {
  cleanResolvedCells();
  Hook.clean();
}
