import { clearModuleMap } from '@cellularjs/di';
import { clearServiceProviders, clearServiceProxies } from '../service-helper';
import { clearResolvedCells } from './resolved-cell.data';

/**
 * Reset all stuff related to network:
 * - cells
 * - service providers
 * - service proxy
 * - module map
 */
export async function clearNetwork() {
  clearResolvedCells();
  clearServiceProviders();
  clearServiceProxies();
  clearModuleMap();
}
