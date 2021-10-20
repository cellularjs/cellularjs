import { getInjectable } from '@cellularjs/di'
import { scanJs } from './';

export function scanForProviders(basePath: string) {
  const providers = [];
  scanJs(basePath, (exports) => {
    Object.keys(exports).map(propKey => handleExportProp(
      exports, propKey, providers,
    ));
  });

  return providers;
}

function handleExportProp(moduleExports, propKey, providers: any[]): void {
  const exportProp = moduleExports[propKey];

  if (typeof exportProp !== 'function') {
    return;
  }

  if (!getInjectable(exportProp)) {
    return;
  }

  providers.push(exportProp);
}