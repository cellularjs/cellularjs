import { clearServiceProviders, clearServiceProxies } from '../service-helper';
import { cleanResolvedCells } from './resolved-cell.data';

export async function cleanNetwork() {
  cleanResolvedCells();
  clearServiceProviders();
  clearServiceProxies();
}
