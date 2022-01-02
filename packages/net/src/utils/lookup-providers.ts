import { getInjectable } from '@cellularjs/di';
import { scanJs } from './';

export function scanDirForProviders(basePath: string) {
  let providers = [];

  scanJs(basePath, (module) => {
    const newProviders = extractProvidersFromObj(module);
    providers = providers.concat(newProviders);
  });

  return providers;
}

export function scanModulesForProviders(modules: any[]) {
  let providers = [];

  modules.forEach((module) => {
    const newProviders = extractProvidersFromObj(module);
    providers = providers.concat(newProviders);
  });

  return providers;
}

function extractProvidersFromObj(obj) {
  const providers = [];

  Object.keys(obj).forEach((key) => {
    const prop = obj[key];

    if (typeof prop !== 'function') {
      return;
    }

    if (!getInjectable(prop)) {
      return;
    }

    providers.push(prop);
  });

  return providers;
}
