import { cleanServiceProviders, cleanServiceProxies } from '../service-helper';
import { cleanResolvedCells } from './resolved-cell.data';

export async function cleanNetwork() {
  cleanResolvedCells();
  cleanServiceProviders();
  cleanServiceProxies();
}
