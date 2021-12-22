import { ServiceHandlerClass } from '../internal';
import { getServiceMeta, scanJs } from '.';

type OnServiceFoundFunc = (serviceName: string, serviceClass: ServiceHandlerClass) => void;

export function scanDirForServiceHandler(
  basePath: string,
  onFound: OnServiceFoundFunc,
) {
  scanJs(basePath, (module) => {
    findServiceHandlersFromObj(module, onFound);
  });
}

export function scanModulesForServiceHandler(
  modules: any[],
  onFound: OnServiceFoundFunc,
) {
  modules.forEach(module => {
    findServiceHandlersFromObj(module, onFound);
  });
}

function findServiceHandlersFromObj(obj, onFound: OnServiceFoundFunc) {
  Object.keys(obj).forEach(key => {
    const prop = obj[key];

    if (typeof prop !== 'function') {
      return;
    }

    if (!getServiceMeta(prop)) {
      return;
    }

    onFound(key, prop);
  });
}
